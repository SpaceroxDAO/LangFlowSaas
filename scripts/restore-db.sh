#!/bin/bash
# =============================================================================
# Teach Charlie AI - Database Restore Script
# =============================================================================
# Usage:
#   ./scripts/restore-db.sh backup_file.sql.gz
#   ./scripts/restore-db.sh /path/to/backup.sql.gz
#
# WARNING: This will DROP and recreate the database!
# =============================================================================

set -euo pipefail

# Configuration
CONTAINER_NAME="${POSTGRES_CONTAINER:-teachcharlie-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-teachcharlie}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check arguments
if [ $# -lt 1 ]; then
    log_error "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    log_error "Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

# Check if it's a gzip file
if ! gzip -t "${BACKUP_FILE}" 2>/dev/null; then
    log_error "Invalid backup file (not gzip compressed)"
    exit 1
fi

log_warn "=========================================="
log_warn "WARNING: This will DESTROY all existing data!"
log_warn "Database: ${DB_NAME}"
log_warn "Backup: ${BACKUP_FILE}"
log_warn "=========================================="
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    log_info "Restore cancelled."
    exit 0
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    log_error "Container '${CONTAINER_NAME}' is not running!"
    exit 1
fi

log_info "Starting database restore..."

# Stop dependent services
log_info "Stopping backend and langflow containers..."
docker stop teachcharlie-backend teachcharlie-langflow 2>/dev/null || true

# Drop existing connections and recreate database
log_info "Dropping existing database..."
docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '${DB_NAME}'
  AND pid <> pg_backend_pid();
" postgres || true

docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -c "DROP DATABASE IF EXISTS ${DB_NAME};" postgres
docker exec "${CONTAINER_NAME}" psql -U "${DB_USER}" -c "CREATE DATABASE ${DB_NAME};" postgres

# Restore from backup
log_info "Restoring from backup..."
gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" "${DB_NAME}"

if [ $? -eq 0 ]; then
    log_info "Database restored successfully!"
else
    log_error "Restore failed!"
    exit 1
fi

# Restart dependent services
log_info "Restarting backend and langflow containers..."
docker start teachcharlie-langflow teachcharlie-backend 2>/dev/null || true

# Wait for services
log_info "Waiting for services to start..."
sleep 10

log_info "Restore complete!"
log_info "Please verify the application is working correctly."
