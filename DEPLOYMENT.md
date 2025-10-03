# BullSheet Production Deployment Guide

This guide covers the setup and deployment of BullSheet to a production environment with automatic HTTPS via Caddy and CI/CD via GitHub Actions.

## Architecture Overview

```
Internet → Caddy (Reverse Proxy + HTTPS) → Docker Container (Nginx + React App)
```

### Components

- **Docker**: Containerized React application with optimized Nginx
- **Caddy**: Reverse proxy with automatic HTTPS/SSL certificates
- **GitHub Actions**: CI/CD pipeline for automated deployments
- **Production Branch**: Dedicated branch for production releases

## Server Requirements

### Minimum Specifications
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ or similar Linux distribution

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Git
- curl/wget (for health checks)

## Initial Server Setup

### 1. Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 2. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Create Deployment Directory

```bash
sudo mkdir -p /opt/bullsheet
sudo chown $USER:$USER /opt/bullsheet
cd /opt/bullsheet
```

### 4. Clone Repository

```bash
# Clone repository
git clone https://github.com/your-username/bullsheet.git .

# Checkout production branch
git checkout production
```

## Domain and DNS Setup

### 1. Configure DNS Records

Point your domain to your server's IP address:

```
Type: A
Name: bullsheet.johnlindon.com
Value: YOUR_SERVER_IP
TTL: 300

Type: A  
Name: staging.bullsheet.johnlindon.com
Value: YOUR_SERVER_IP
TTL: 300
```

### 2. Domain Configuration

The Caddyfile is already configured for `bullsheet.johnlindon.com`:

```bash
nano Caddyfile
```

## Environment Configuration

### 1. Production Environment

Copy and customize the production environment file:

```bash
cp .env.production .env.local
nano .env.local
```

### 2. Configure Secrets

For sensitive configuration, use environment variables or a secrets management system.

## Manual Deployment

### 1. Build and Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh deploy
```

### 2. Verify Deployment

```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs

# Test health endpoint
curl http://localhost:8080/health

# Test application
curl -I https://bullsheet.johnlindon.com
```

## Automated Deployment (CI/CD)

### 1. GitHub Secrets Setup

Configure the following secrets in your GitHub repository (`Settings → Secrets and Variables → Actions`):

```
PRODUCTION_HOST=your.server.ip
PRODUCTION_USER=your_ssh_user
PRODUCTION_SSH_KEY=your_ssh_private_key
PRODUCTION_PORT=22

# Optional: Staging server
STAGING_HOST=your.staging.server.ip
STAGING_USER=your_ssh_user  
STAGING_SSH_KEY=your_ssh_private_key

# Optional: Slack notifications
SLACK_WEBHOOK=your_slack_webhook_url
```

### 2. SSH Key Setup

Generate SSH keys for GitHub Actions:

```bash
# On your local machine
ssh-keygen -t ed25519 -f github-actions-key

# Copy public key to server
ssh-copy-id -i github-actions-key.pub user@your.server.ip

# Add private key to GitHub Secrets as PRODUCTION_SSH_KEY
cat github-actions-key
```

### 3. Create Production Branch

```bash
# Create production branch from main
git checkout main
git pull origin main
git checkout -b production
git push origin production
```

### 4. Automated Deployment

Deployments are triggered automatically when:
- Code is pushed to the `production` branch
- Manual workflow dispatch is triggered

## Deployment Operations

### View Status

```bash
sudo ./deploy.sh status
```

### View Logs

```bash
sudo ./deploy.sh logs
```

### Rollback

```bash
sudo ./deploy.sh rollback
```

### Manual Container Management

```bash
# Stop services
docker compose -f docker-compose.prod.yml down

# Start services
docker compose -f docker-compose.prod.yml up -d

# Restart specific service
docker compose -f docker-compose.prod.yml restart app

# View resource usage
docker stats
```

## Monitoring and Maintenance

### Health Checks

The deployment includes built-in health checks:

- **Application**: `http://localhost/health`
- **Caddy**: `http://localhost:8080/health`

### Log Management

Logs are automatically rotated by Caddy. View logs:

```bash
# Application logs
docker compose -f docker-compose.prod.yml logs app

# Caddy logs
docker compose -f docker-compose.prod.yml logs caddy

# System logs
tail -f /var/log/bullsheet-deploy.log
```

### Backup Management

Backups are created automatically during deployments in `/opt/bullsheet/backups/`. 

To manually create a backup:

```bash
sudo tar -czf backup-$(date +%Y%m%d).tar.gz -C /opt/bullsheet .
```

### SSL Certificate Management

Caddy automatically manages SSL certificates. To check status:

```bash
docker compose -f docker-compose.prod.yml exec caddy caddy list-certificates
```

## Troubleshooting

### Common Issues

1. **Containers not starting**
   ```bash
   docker compose -f docker-compose.prod.yml logs
   ```

2. **SSL certificate issues**
   ```bash
   # Check Caddy logs
   docker compose -f docker-compose.prod.yml logs caddy
   
   # Restart Caddy
   docker compose -f docker-compose.prod.yml restart caddy
   ```

3. **Health check failures**
   ```bash
   # Test app directly
   curl http://localhost/health
   
   # Check app logs
   docker compose -f docker-compose.prod.yml logs app
   ```

4. **Build failures**
   ```bash
   # Check GitHub Actions logs
   # Ensure all dependencies are installed
   # Verify TypeScript compilation
   ```

### Performance Optimization

1. **Enable Nginx caching**
   - Static assets are cached for 1 year
   - Gzip compression is enabled

2. **Monitor resource usage**
   ```bash
   docker stats
   htop
   df -h
   ```

3. **Database optimization** (if applicable)
   - Add database containers to docker-compose
   - Configure connection pooling
   - Set up backup strategies

## Security Considerations

### Best Practices

1. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade
   docker image prune -f
   ```

2. **Use non-root containers**
   - Containers run as non-root users
   - Limited filesystem access

3. **Network security**
   - Firewall configured for essential ports only
   - Internal Docker network isolation

4. **Secret management**
   - No secrets in code or environment files
   - Use GitHub Secrets for CI/CD
   - Consider external secret management

### Security Headers

The deployment includes comprehensive security headers:
- HSTS (HTTP Strict Transport Security)
- CSP (Content Security Policy)
- X-Frame-Options
- X-Content-Type-Options

## Scaling and High Availability

### Horizontal Scaling

To scale the application:

```bash
# Scale app containers
docker compose -f docker-compose.prod.yml up -d --scale app=3

# Update Caddy load balancing
# Edit Caddyfile to include multiple backends
```

### Load Balancer Setup

For multiple servers, use an external load balancer (AWS ALB, Cloudflare, etc.) pointing to multiple instances.

### Database Considerations

For production databases:
- Use managed database services (AWS RDS, Google Cloud SQL)
- Configure connection pooling
- Set up read replicas for scaling
- Implement backup strategies

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Check logs and resource usage
2. **Monthly**: Update system packages and Docker images
3. **Quarterly**: Review and rotate secrets
4. **As needed**: Scale resources based on usage

### Getting Help

- Check GitHub Issues for known problems
- Review deployment logs for specific errors
- Consult Docker and Caddy documentation
- Monitor application performance metrics

---

For additional support or questions about the deployment process, please create an issue in the GitHub repository.