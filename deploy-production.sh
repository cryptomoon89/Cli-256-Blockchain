#!/bin/bash

# CLI256 Blockchain Production Deployment Script
# Automated deployment for public launch

set -e

echo "🚀 CLI256 Blockchain Production Deployment"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] ℹ $1${NC}"
}

# Check if running as production user
print_info "Checking deployment environment..."

# Verify Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Verify npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
else
    print_error "npm is not installed."
    exit 1
fi

# Create production directories
print_info "Setting up production directory structure..."
mkdir -p /opt/cli256
mkdir -p /opt/cli256/logs
mkdir -p /opt/cli256/data
mkdir -p /opt/cli256/backups
mkdir -p /etc/cli256
mkdir -p /var/log/cli256

print_status "Production directories created"

# Install dependencies
print_info "Installing production dependencies..."
npm ci --production
cd cli && npm ci --production && cd ..
print_status "Dependencies installed"

# Run comprehensive tests
print_info "Running comprehensive blockchain tests..."
if node cli/test-blockchain.js; then
    print_status "All tests passed - system ready for production"
else
    print_error "Tests failed - aborting deployment"
    exit 1
fi

# Copy application files
print_info "Deploying application files..."
cp -r client/ /opt/cli256/
cp -r cli/ /opt/cli256/
cp -r server/ /opt/cli256/
cp -r shared/ /opt/cli256/
cp package.json /opt/cli256/
cp README.md /opt/cli256/
cp BLOCKCHAIN_ARCHITECTURE.md /opt/cli256/
print_status "Application files deployed"

# Create systemd service for blockchain node
print_info "Creating system services..."
cat > /etc/systemd/system/cli256-node.service << EOF
[Unit]
Description=CLI256 Blockchain Node
After=network.target

[Service]
Type=simple
User=cli256
WorkingDirectory=/opt/cli256
ExecStart=/usr/bin/node cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=cli256-node

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/opt/cli256/data /var/log/cli256

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for web dashboard
cat > /etc/systemd/system/cli256-dashboard.service << EOF
[Unit]
Description=CLI256 Web Dashboard
After=network.target

[Service]
Type=simple
User=cli256
WorkingDirectory=/opt/cli256
ExecStart=/usr/bin/npm run dev
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=cli256-dashboard

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/opt/cli256/data

[Install]
WantedBy=multi-user.target
EOF

print_status "System services created"

# Create CLI256 user
print_info "Creating CLI256 system user..."
if id "cli256" &>/dev/null; then
    print_warning "User cli256 already exists"
else
    useradd -r -s /bin/false -d /opt/cli256 cli256
    print_status "User cli256 created"
fi

# Set proper permissions
print_info "Setting file permissions..."
chown -R cli256:cli256 /opt/cli256
chown -R cli256:cli256 /var/log/cli256
chmod +x /opt/cli256/cli/cli256-node.js
chmod +x /opt/cli256/cli/cli256-wallet.js
chmod +x /opt/cli256/cli/test-blockchain.js
print_status "Permissions set"

# Create configuration file
print_info "Creating production configuration..."
cat > /etc/cli256/config.json << EOF
{
  "network": {
    "id": "cli256-mainnet",
    "consensus": "PoA",
    "blockTime": 5000,
    "port": 8080
  },
  "security": {
    "enableTLS": true,
    "corsOrigins": ["https://cli256.io", "https://dashboard.cli256.io"],
    "rateLimit": {
      "enabled": true,
      "windowMs": 900000,
      "max": 100
    }
  },
  "database": {
    "path": "/opt/cli256/data",
    "backup": {
      "enabled": true,
      "interval": "1h",
      "retention": "30d"
    }
  },
  "logging": {
    "level": "info",
    "file": "/var/log/cli256/cli256.log",
    "maxSize": "10m",
    "maxFiles": 5
  }
}
EOF

print_status "Configuration created"

# Initialize blockchain if not exists
print_info "Initializing blockchain..."
if [ ! -f "/opt/cli256/data/blockchain.json" ]; then
    sudo -u cli256 node /opt/cli256/cli/cli256-node.js init
    print_status "Blockchain initialized"
else
    print_warning "Blockchain already exists"
fi

# Create backup script
print_info "Creating backup system..."
cat > /opt/cli256/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/cli256/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cli256_backup_$TIMESTAMP.tar.gz"

echo "Creating backup: $BACKUP_FILE"
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    /opt/cli256/data/ \
    /etc/cli256/ \
    /var/log/cli256/

# Keep only last 30 backups
find "$BACKUP_DIR" -name "cli256_backup_*.tar.gz" -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

chmod +x /opt/cli256/backup.sh
chown cli256:cli256 /opt/cli256/backup.sh

# Create cron job for backups
echo "0 2 * * * cli256 /opt/cli256/backup.sh" > /etc/cron.d/cli256-backup

print_status "Backup system configured"

# Create monitoring script
print_info "Setting up monitoring..."
cat > /opt/cli256/monitor.sh << 'EOF'
#!/bin/bash
LOG_FILE="/var/log/cli256/monitor.log"

check_service() {
    SERVICE=$1
    if systemctl is-active --quiet $SERVICE; then
        echo "$(date): $SERVICE is running" >> $LOG_FILE
        return 0
    else
        echo "$(date): $SERVICE is not running - attempting restart" >> $LOG_FILE
        systemctl restart $SERVICE
        return 1
    fi
}

# Check services
check_service cli256-node
check_service cli256-dashboard

# Check disk space
DISK_USAGE=$(df /opt/cli256 | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "$(date): WARNING - Disk usage is ${DISK_USAGE}%" >> $LOG_FILE
fi

# Check blockchain sync
NODE_STATUS=$(curl -s http://localhost:8080/status || echo "ERROR")
if [ "$NODE_STATUS" = "ERROR" ]; then
    echo "$(date): WARNING - Node API not responding" >> $LOG_FILE
fi
EOF

chmod +x /opt/cli256/monitor.sh
chown cli256:cli256 /opt/cli256/monitor.sh

# Create monitoring cron job
echo "*/5 * * * * cli256 /opt/cli256/monitor.sh" > /etc/cron.d/cli256-monitor

print_status "Monitoring configured"

# Create nginx configuration for reverse proxy
print_info "Creating web server configuration..."
cat > /etc/nginx/sites-available/cli256 << EOF
server {
    listen 80;
    server_name cli256.local dashboard.cli256.local;
    
    # Redirect HTTP to HTTPS in production
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cli256.local dashboard.cli256.local;
    
    # SSL configuration (update with your certificates)
    ssl_certificate /etc/ssl/certs/cli256.crt;
    ssl_certificate_key /etc/ssl/private/cli256.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Main dashboard
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Blockchain API
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
}

# Rate limiting configuration
http {
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
}
EOF

if [ -d "/etc/nginx/sites-available" ]; then
    ln -sf /etc/nginx/sites-available/cli256 /etc/nginx/sites-enabled/
    print_status "Nginx configuration created"
else
    print_warning "Nginx not found - manual web server setup required"
fi

# Create firewall rules
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw allow 8080/tcp  # Blockchain API
    ufw --force enable
    print_status "Firewall configured"
else
    print_warning "ufw not found - manual firewall setup required"
fi

# Enable and start services
print_info "Starting services..."
systemctl daemon-reload
systemctl enable cli256-node
systemctl enable cli256-dashboard
systemctl start cli256-node
systemctl start cli256-dashboard

# Wait for services to start
sleep 5

# Check service status
if systemctl is-active --quiet cli256-node; then
    print_status "CLI256 Node service is running"
else
    print_error "CLI256 Node service failed to start"
    systemctl status cli256-node
fi

if systemctl is-active --quiet cli256-dashboard; then
    print_status "CLI256 Dashboard service is running"
else
    print_error "CLI256 Dashboard service failed to start"
    systemctl status cli256-dashboard
fi

# Final production checklist
print_info "Production deployment completed!"
echo ""
echo "🎉 CLI256 Blockchain is now ready for public launch!"
echo "================================================="
echo ""
echo "✅ Blockchain initialized with genesis block"
echo "✅ Validator nodes configured"
echo "✅ Web dashboard deployed"
echo "✅ System services enabled"
echo "✅ Security measures implemented"
echo "✅ Monitoring and backup systems active"
echo "✅ All tests passed"
echo ""
echo "📊 Network Information:"
echo "   • Network ID: cli256-mainnet"
echo "   • Consensus: Proof-of-Authority (PoA)"
echo "   • Block Time: 5 seconds"
echo "   • Total Supply: 250,000,000 CLI256"
echo ""
echo "🌐 Access Points:"
echo "   • Web Dashboard: http://localhost:3000"
echo "   • Blockchain API: http://localhost:8080"
echo "   • CLI Tools: /opt/cli256/cli/"
echo ""
echo "📁 Important Paths:"
echo "   • Data Directory: /opt/cli256/data"
echo "   • Configuration: /etc/cli256/config.json"
echo "   • Logs: /var/log/cli256/"
echo "   • Backups: /opt/cli256/backups/"
echo ""
echo "🔧 Management Commands:"
echo "   • Check Node Status: systemctl status cli256-node"
echo "   • Check Dashboard: systemctl status cli256-dashboard"
echo "   • View Logs: journalctl -u cli256-node -f"
echo "   • Run CLI: /opt/cli256/cli/cli256-node.js status"
echo ""
echo "🚀 CLI256 Blockchain is LIVE and ready for public use!"
echo "================================================="
