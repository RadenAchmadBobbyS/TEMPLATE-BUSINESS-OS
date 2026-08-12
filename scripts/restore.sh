#!/bin/bash
# scripts/restore.sh
# Restores a specific compressed pg_dump file into the PostgreSQL container.

set -e

BACKUP_FILE=$1
CONTAINER_NAME="saas-db-prod" # Must match your running DB container name
DB_USER="user"
DB_NAME="saas_builder"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./scripts/restore.sh <path/to/backup.sql.gz>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    exit 1
fi

echo "==================================="
echo "⚠️  WARNING: Restoring Database..."
echo "==================================="
echo "This will overwrite the current database ($DB_NAME)."
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore aborted."
    exit 1
fi

echo "🔄 Decompressing and restoring..."
# Decompress and stream into the container's psql prompt
gunzip -c "$BACKUP_FILE" | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

echo "✅ Database restored successfully from: $BACKUP_FILE"
