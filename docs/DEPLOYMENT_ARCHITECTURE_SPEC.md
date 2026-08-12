# Deployment Architecture Specification

**Overview**: This document defines the self-hosted, scalable deployment architecture designed to circumvent vendor lock-in (e.g., hard dependency on Vercel) while maintaining enterprise-grade horizontal scalability, high availability, and disaster recovery.

---

## 1. Global Architecture Diagram

The system operates behind Nginx as a reverse proxy, routing traffic to a cluster of horizontally scaled Next.js nodes managed by PM2 inside Docker containers.

```mermaid
graph TD
    User((Internet Users)) --> CDN[Cloudflare / Edge CDN]
    CDN --> LoadBalancer[Nginx Load Balancer]
    
    subgraph App Cluster
        LoadBalancer --> Node1[Docker: Next.js + PM2 (Port 3001)]
        LoadBalancer --> Node2[Docker: Next.js + PM2 (Port 3002)]
        LoadBalancer --> Node3[Docker: Next.js + PM2 (Port 3003)]
    end
    
    subgraph Data Layer
        Node1 --> Redis[(Redis Cluster)]
        Node2 --> Redis
        Node3 --> Redis
        
        Node1 --> Prisma[Prisma Connection Pooler]
        Node2 --> Prisma
        Node3 --> Prisma
        
        Prisma --> PrimaryDB[(PostgreSQL Primary)]
        Prisma --> ReplicaDB[(PostgreSQL Read Replica)]
    end
    
    subgraph Storage & Logging
        Node1 --> S3[(Object Storage / AWS S3)]
        Node1 --> Datadog[Datadog / ELK Log Aggregator]
    end
```

---

## 2. Deployment Flow & CI/CD Pipeline

**Technologies**: GitHub Actions, Docker.

### A. The CI/CD Pipeline
1. **Push & Test**: Developer merges code into the `main` branch. GitHub Actions intercepts the webhook.
2. **Lint & Typecheck**: The pipeline runs `npm run lint`, `tsc --noEmit`, and `npx prisma validate`.
3. **Build**: Next.js compiles the `.next` production bundle (`npm run build`).
4. **Dockerization**: The entire application (Next.js bundle, `node_modules`, `prisma/schema.prisma`) is packaged into an optimized, multi-stage Docker image (using Alpine Linux to keep image size < 150MB).
5. **Registry Push**: The image is tagged (e.g., `v1.2.0`) and pushed to a secure Docker Registry (AWS ECR or GitHub Container Registry).
6. **Rolling Deployment**: A webhook signals the production swarm to pull the new image. Nodes are restarted sequentially using PM2's cluster mode (zero-downtime reload) behind Nginx.

### B. Environment Variables
- Environment variables (`DATABASE_URL`, `STRIPE_SECRET_KEY`) are *never* baked into the Docker image.
- They are injected securely at runtime via a `.env` file mounted directly into the Docker container from a secure Secrets Manager (AWS Secrets Manager / HashiCorp Vault).

---

## 3. Horizontal Scaling & Performance Optimization

**Technologies**: Nginx, PM2, Redis.

### A. Scaling Strategy
- **PM2 Cluster Mode**: Inside the Docker container, PM2 spins up `N` instances of the Next.js server, where `N` is the number of available CPU cores. This utilizes 100% of the virtual machine's compute power.
- **Nginx Round Robin**: As traffic spikes, the orchestrator (Kubernetes or Docker Swarm) spins up new replica containers. Nginx automatically discovers these new nodes and load-balances traffic across them using a round-robin or least-connections algorithm.
- **Prisma Connection Pooling**: Next.js Serverless/PM2 functions can rapidly exhaust PostgreSQL connection limits. We utilize `PgBouncer` (or Prisma Accelerate) between the App Cluster and the DB to multiplex thousands of app connections down to ~50 physical database connections.

### B. Performance Optimization
- **Session & Caching**: The Next.js Edge Cache and active user sessions are explicitly decoupled from the Node.js memory and offloaded to the **Redis Cluster**. This ensures that if a user's traffic is routed to `Node2` after logging in on `Node1`, their session and cached HTML remain perfectly intact (Stateless Architecture).

---

## 4. Security & Monitoring

**Technologies**: Datadog, Prometheus/Grafana.

### A. Security
- **Internal Network**: PostgreSQL and Redis are placed in a private subnet (VPC) with no public internet access. They can only be queried by the Nginx/Docker swarm.
- **Object Storage**: S3 buckets are marked Private. Public read access is strictly mediated through Cloudflare to enforce DDoS protection.

### B. Monitoring & Logging
- **Application Metrics**: PM2 exposes standard Node.js metrics (Event Loop Lag, Memory Heap).
- **Log Aggregation**: Next.js application logs (JSON structured logs via `pino`) are flushed out of the Docker container's `stdout` and ingested by an agent (Datadog/Fluentd) for central querying.
- **Alerting**: If 5xx errors spike above 1%, or if PostgreSQL CPU hits > 80%, automated PagerDuty alerts are fired to the DevOps team.

---

## 5. Disaster Recovery (Backup & Restore Strategy)

### A. Backup Strategy
- **PostgreSQL**: Automated Point-in-Time Recovery (PITR) is enabled via Write-Ahead Logs (WAL) streaming. Database snapshots are taken daily and shipped to a geographically isolated S3 bucket (e.g., from `us-east-1` to `eu-west-1`).
- **Object Storage**: S3 Cross-Region Replication is enabled. If AWS US-East goes down, all customer images and PDFs are instantly available in EU-West.

### B. Restore Strategy (RTO/RPO < 1 Hour)
1. **Trigger**: A catastrophic failure occurs (e.g., accidental table drop).
2. **DB Rollback**: DevOps issues a command to restore the Postgres database to a specific millisecond before the failure occurred using the PITR WAL logs.
3. **Application Redeploy**: GitHub Actions re-triggers the exact Docker image tag known to be stable.
4. **DNS Failover**: If the primary region physically burns down, Cloudflare DNS is flipped to point to the secondary region where a standby Nginx/Docker swarm automatically connects to the replicated database.
