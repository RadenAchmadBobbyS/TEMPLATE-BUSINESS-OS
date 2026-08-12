#!/bin/bash
# scripts/backup.sh
# Performs a pg_dump of the PostgreSQL container and compresses it.

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
CONTAINER_NAME="saas-db-prod" # Must match your running DB container name
DB_USER="user"
DB_NAME="saas_builder"

mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

echo "==================================="
echo "💾 Starting Database Backup..."
echo "==================================="

# Execute pg_dump inside the running container and gzip the output
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -c | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    echo "✅ Backup successfully created: $BACKUP_FILE"
    
    # Optional: Keep only the last 7 backups to save space
    ls -t $BACKUP_DIR/db_backup_*.sql.gz | tail -n +8 | xargs -r rm --
    echo "🧹 Cleaned up old backups."
else
    echo "❌ Backup failed!"
    exit 1
fi
