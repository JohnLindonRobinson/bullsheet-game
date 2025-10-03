#!/bin/bash

# BullSheet Production Deployment Script
# This script handles the deployment of BullSheet to production servers

set -e  # Exit on any error

# Configuration
DEPLOY_DIR="/opt/bullsheet"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/bullsheet/backups"
LOG_FILE="/var/log/bullsheet-deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
    fi
}

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker is not running"
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
    fi
}

# Create backup of current deployment
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        log "Creating backup of current deployment..."
        mkdir -p "$BACKUP_DIR"
        BACKUP_NAME="bullsheet-backup-$(date +%Y%m%d-%H%M%S)"
        tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$DEPLOY_DIR" . 2>/dev/null || true
        log "Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t bullsheet-backup-*.tar.gz | tail -n +6 | xargs -r rm --
    fi
}

# Deploy application
deploy() {
    log "Starting BullSheet deployment..."
    
    # Create deployment directory
    mkdir -p "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
    
    # Pull latest code if git repo exists
    if [ -d ".git" ]; then
        log "Pulling latest code from production branch..."
        git fetch origin
        git checkout production
        git pull origin production
    else
        warning "Not a git repository. Assuming files are already in place."
    fi
    
    # Stop existing containers
    if [ -f "$COMPOSE_FILE" ]; then
        log "Stopping existing containers..."
        docker compose -f "$COMPOSE_FILE" down || true
    fi
    
    # Pull latest images
    log "Pulling latest Docker images..."
    docker compose -f "$COMPOSE_FILE" pull
    
    # Start containers
    log "Starting containers..."
    docker compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    # Health check
    log "Running health checks..."
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        log "✓ Health check passed"
    else
        error "✗ Health check failed"
    fi
    
    # Verify containers are running
    if docker compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log "✓ Containers are running"
    else
        error "✗ Some containers are not running"
    fi
    
    # Clean up old images
    log "Cleaning up old Docker images..."
    docker image prune -f >/dev/null 2>&1 || true
    
    log "🚀 Deployment completed successfully!"
}

# Rollback to previous version
rollback() {
    log "Rolling back to previous deployment..."
    
    # Stop current containers
    docker compose -f "$COMPOSE_FILE" down || true
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/bullsheet-backup-*.tar.gz 2>/dev/null | head -n 1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        error "No backup found for rollback"
    fi
    
    # Restore backup
    log "Restoring from backup: $LATEST_BACKUP"
    cd "$DEPLOY_DIR"
    tar -xzf "$LATEST_BACKUP"
    
    # Start containers
    docker compose -f "$COMPOSE_FILE" up -d
    
    log "✓ Rollback completed"
}

# Show status
status() {
    log "BullSheet Deployment Status:"
    echo
    
    if [ -f "$DEPLOY_DIR/$COMPOSE_FILE" ]; then
        cd "$DEPLOY_DIR"
        docker compose -f "$COMPOSE_FILE" ps
        echo
        docker compose -f "$COMPOSE_FILE" logs --tail=20
    else
        warning "No deployment found"
    fi
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_permissions
        check_docker
        create_backup
        deploy
        ;;
    "rollback")
        check_permissions
        check_docker
        rollback
        ;;
    "status")
        status
        ;;
    "logs")
        if [ -f "$DEPLOY_DIR/$COMPOSE_FILE" ]; then
            cd "$DEPLOY_DIR"
            docker compose -f "$COMPOSE_FILE" logs -f
        else
            error "No deployment found"
        fi
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|status|logs}"
        echo
        echo "Commands:"
        echo "  deploy   - Deploy latest version (default)"
        echo "  rollback - Rollback to previous version"
        echo "  status   - Show deployment status"
        echo "  logs     - Show container logs"
        exit 1
        ;;
esac