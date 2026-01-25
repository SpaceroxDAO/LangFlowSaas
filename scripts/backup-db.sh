#!/bin/bash
# =============================================================================
# Teach Charlie AI - Database Backup Script
# =============================================================================
# Usage:
#   ./scripts/backup-db.sh                    # Backup to default location
#   ./scripts/backup-db.sh /path/to/backup    # Backup to specified directory
#   UPLOAD_TO_S3=true ./scripts/backup-db.sh  # Upload to S3 after backup
#
# Environment Variables:
#   POSTGRES_CONTAINER - Container name (default: teachcharlie-postgres)
#   POSTGRES_USER      - Database user (default: from env or 'postgres')
#   POSTGRES_DB        - Database name (default: teachcharlie)
#   BACKUP_RETENTION   - Days to keep backups (default: 30)
#   S3_BUCKET          - S3 bucket for remote backup (optional)
#   AWS_PROFILE        - AWS profile for S3 upload (optional)
# =============================================================================

set -euo pipefail

# Configuration
CONTAINER_NAME="${POSTGRES_CONTAINER:-teachcharlie-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-teachcharlie}"
BACKUP_DIR="${1:-/root/backups/postgres}"
BACKUP_RETENTION="${BACKUP_RETENTION:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="teachcharlie_${TIMESTAMP}.sql.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

log_info "Starting database backup..."
log_info "Container: ${CONTAINER_NAME}"
log_info "Database: ${DB_NAME}"
log_info "Backup path: ${BACKUP_PATH}"

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    log_error "Container '${CONTAINER_NAME}' is not running!"
    exit 1
fi

# Perform backup
log_info "Creating backup..."
docker exec "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" "${DB_NAME}" | gzip > "${BACKUP_PATH}"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_PATH}" | cut -f1)
    log_info "Backup completed successfully!"
    log_info "Backup size: ${BACKUP_SIZE}"
else
    log_error "Backup failed!"
    exit 1
fi

# Verify backup integrity
log_info "Verifying backup integrity..."
if gzip -t "${BACKUP_PATH}" 2>/dev/null; then
    log_info "Backup integrity verified."
else
    log_error "Backup file is corrupted!"
    exit 1
fi

# Upload to S3 if configured
if [ "${UPLOAD_TO_S3:-false}" = "true" ] && [ -n "${S3_BUCKET:-}" ]; then
    log_info "Uploading to S3: s3://${S3_BUCKET}/backups/postgres/${BACKUP_FILE}"

    AWS_ARGS=""
    if [ -n "${AWS_PROFILE:-}" ]; then
        AWS_ARGS="--profile ${AWS_PROFILE}"
    fi

    if aws s3 cp "${BACKUP_PATH}" "s3://${S3_BUCKET}/backups/postgres/${BACKUP_FILE}" ${AWS_ARGS}; then
        log_info "S3 upload completed."
    else
        log_warn "S3 upload failed, but local backup is saved."
    fi
fi

# Clean up old backups
log_info "Cleaning up backups older than ${BACKUP_RETENTION} days..."
DELETED_COUNT=$(find "${BACKUP_DIR}" -name "teachcharlie_*.sql.gz" -type f -mtime +${BACKUP_RETENTION} -delete -print | wc -l)
log_info "Deleted ${DELETED_COUNT} old backup(s)."

# List current backups
log_info "Current backups:"
ls -lh "${BACKUP_DIR}"/teachcharlie_*.sql.gz 2>/dev/null | tail -10 || echo "No backups found"

# Summary
echo ""
log_info "=== Backup Summary ==="
log_info "Backup file: ${BACKUP_PATH}"
log_info "Backup size: ${BACKUP_SIZE}"
log_info "Retention: ${BACKUP_RETENTION} days"
echo ""
log_info "Done!"
