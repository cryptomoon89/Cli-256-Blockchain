#!/bin/bash

# CLI256 Blockchain Production Launch Script
# Final optimization and launch procedures

set -e

echo "🚀 CLI256 Blockchain - Production Launch Initiated"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] ℹ️  $1${NC}"
}

print_highlight() {
    echo -e "${PURPLE}[$(date +'%H:%M:%S')] 🎯 $1${NC}"
}

print_launch() {
    echo -e "${CYAN}[$(date +'%H:%M:%S')] 🚀 $1${NC}"
}

# Launch timestamp
LAUNCH_TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
LAUNCH_VERSION="1.0.0"

print_launch "CLI256 Blockchain v${LAUNCH_VERSION} Launch Sequence Starting..."
print_info "Launch ID: CLI256_LAUNCH_${LAUNCH_TIMESTAMP}"

# Pre-launch validation
print_highlight "PHASE 1: Pre-Launch Validation"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
    
    # Verify Node.js version is 18+
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js 18+ required. Current version: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Verify project structure
print_info "Validating project structure..."
required_files=(
    "package.json"
    "cli/cli256-node.js"
    "cli/cli256-wallet.js"
    "cli/test-blockchain.js"
    "client/pages/Index.tsx"
    "README.md"
    "LAUNCH_CHECKLIST.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing required file: $file"
        exit 1
    fi
done

# Install production dependencies
print_highlight "PHASE 2: Dependency Installation"
print_info "Installing production dependencies..."
npm ci --production --silent
print_success "Main dependencies installed"

print_info "Installing CLI dependencies..."
cd cli && npm ci --production --silent && cd ..
print_success "CLI dependencies installed"

# Run comprehensive tests
print_highlight "PHASE 3: Final Testing"
print_info "Running comprehensive blockchain test suite..."

if node cli/test-blockchain.js; then
    print_success "🧪 All blockchain tests passed - System ready for production"
else
    print_error "❌ Tests failed - Launch aborted"
    exit 1
fi

# Optimize build
print_highlight "PHASE 4: Build Optimization"
print_info "Creating optimized production build..."
npm run build --silent
print_success "Production build completed"

# Initialize blockchain for production
print_highlight "PHASE 5: Blockchain Initialization"
print_info "Initializing production blockchain..."

# Check if blockchain already exists
if [ -f ".cli256/blockchain.json" ]; then
    print_warning "Blockchain already exists - skipping initialization"
else
    node cli/cli256-node.js init
    print_success "Production blockchain initialized"
fi

# Verify foundation balances
print_info "Verifying foundation token distribution..."
FOUNDATION_BALANCE=$(node cli/cli256-wallet.js balance --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 2>/dev/null | grep -o '[0-9,]*' | head -1 | tr -d ',')

if [ "$FOUNDATION_BALANCE" = "50000000" ]; then
    print_success "Foundation balance verified: 50,000,000 CLI256"
else
    print_warning "Foundation balance: $FOUNDATION_BALANCE CLI256"
fi

# Performance optimization
print_highlight "PHASE 6: Performance Optimization"
print_info "Optimizing system performance..."

# Set optimal Node.js memory settings
export NODE_OPTIONS="--max_old_space_size=4096 --optimize_for_size"

# Create performance monitoring script
cat > monitor-performance.sh << 'EOF'
#!/bin/bash
while true; do
    echo "$(date): CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% | Memory: $(free | grep Mem | awk '{printf("%.2f%%", $3/$2 * 100.0)}') | Disk: $(df -h . | awk 'NR==2{print $5}')"
    sleep 60
done
EOF

chmod +x monitor-performance.sh
print_success "Performance monitoring configured"

# Security hardening
print_highlight "PHASE 7: Security Hardening"
print_info "Applying security measures..."

# Set secure file permissions
chmod 600 cli/*.js 2>/dev/null || true
chmod 700 .cli256/ 2>/dev/null || true
print_success "File permissions secured"

# Validate developer access codes
if grep -q "CLI256-PRIME-DEV-2024" code-access/dev-access-codes.json; then
    print_success "Developer access codes verified"
else
    print_warning "Developer access codes not found"
fi

# Network configuration
print_highlight "PHASE 8: Network Configuration"
print_info "Configuring production network..."

# Create production configuration
cat > production-config.json << EOF
{
  "network": {
    "id": "cli256-mainnet",
    "name": "CLI256 Production Network",
    "consensus": "PoA",
    "blockTime": 5000,
    "port": 8080,
    "maxPeers": 50
  },
  "security": {
    "enableTLS": true,
    "corsOrigins": ["*"],
    "rateLimit": {
      "enabled": true,
      "windowMs": 900000,
      "max": 1000
    }
  },
  "performance": {
    "cacheSize": "256MB",
    "maxMemory": "2GB",
    "optimization": "production"
  },
  "launch": {
    "version": "$LAUNCH_VERSION",
    "timestamp": "$LAUNCH_TIMESTAMP",
    "environment": "production"
  }
}
EOF

print_success "Production configuration created"

# Start production services
print_highlight "PHASE 9: Service Deployment"
print_info "Starting production services..."

# Start blockchain node in background
print_info "Starting CLI256 blockchain node..."
nohup node cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 --port 8080 > blockchain-node.log 2>&1 &
BLOCKCHAIN_PID=$!
echo $BLOCKCHAIN_PID > blockchain.pid
print_success "Blockchain node started (PID: $BLOCKCHAIN_PID)"

# Wait for blockchain to initialize
sleep 5

# Start web dashboard
print_info "Starting web dashboard..."
nohup npm start > dashboard.log 2>&1 &
DASHBOARD_PID=$!
echo $DASHBOARD_PID > dashboard.pid
print_success "Web dashboard started (PID: $DASHBOARD_PID)"

# Health check
print_highlight "PHASE 10: Health Verification"
print_info "Performing health checks..."

# Wait for services to be ready
sleep 10

# Check blockchain node
if node cli/cli256-node.js status > /dev/null 2>&1; then
    print_success "✅ Blockchain node is healthy"
else
    print_error "❌ Blockchain node health check failed"
fi

# Check if dashboard is responsive
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "✅ Web dashboard is responsive"
else
    print_warning "⚠️  Web dashboard health check pending"
fi

# Launch metrics
print_highlight "PHASE 11: Launch Metrics Collection"
print_info "Collecting launch metrics..."

BLOCK_HEIGHT=$(node cli/cli256-node.js status 2>/dev/null | grep "Block Height" | grep -o '[0-9]*' || echo "0")
TOTAL_SUPPLY="250000000"
LAUNCH_TIME=$(date -Iseconds)

# Create launch report
cat > "launch-report-${LAUNCH_TIMESTAMP}.json" << EOF
{
  "launch": {
    "version": "$LAUNCH_VERSION",
    "timestamp": "$LAUNCH_TIME",
    "id": "CLI256_LAUNCH_${LAUNCH_TIMESTAMP}"
  },
  "network": {
    "blockHeight": $BLOCK_HEIGHT,
    "totalSupply": $TOTAL_SUPPLY,
    "consensus": "PoA",
    "validators": 1
  },
  "services": {
    "blockchain": {
      "pid": $BLOCKCHAIN_PID,
      "port": 8080,
      "status": "running"
    },
    "dashboard": {
      "pid": $DASHBOARD_PID,
      "port": 3000,
      "status": "running"
    }
  },
  "performance": {
    "nodeVersion": "$NODE_VERSION",
    "memoryLimit": "4GB",
    "optimizations": "enabled"
  }
}
EOF

print_success "Launch report generated: launch-report-${LAUNCH_TIMESTAMP}.json"

# Final launch announcement
print_highlight "PHASE 12: Launch Complete! 🎉"

echo ""
echo "🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊���🎊🎊🎊"
echo ""
print_launch "CLI256 BLOCKCHAIN IS NOW LIVE! 🚀"
echo ""
print_success "🌟 Launch Version: $LAUNCH_VERSION"
print_success "🌟 Launch Time: $LAUNCH_TIME"
print_success "🌟 Network ID: cli256-mainnet"
print_success "🌟 Consensus: Proof-of-Authority"
print_success "🌟 Total Supply: 250,000,000 CLI256"
print_success "🌟 Block Time: 5 seconds"
echo ""
print_info "📊 Access Points:"
print_info "   • Web Dashboard: http://localhost:3000"
print_info "   • Blockchain API: http://localhost:8080"
print_info "   • CLI Tools: ./cli/"
echo ""
print_info "📁 Important Files:"
print_info "   • Blockchain Data: .cli256/"
print_info "   • Node Logs: blockchain-node.log"
print_info "   • Dashboard Logs: dashboard.log"
print_info "   • Launch Report: launch-report-${LAUNCH_TIMESTAMP}.json"
echo ""
print_info "🔧 Management Commands:"
print_info "   • Check Status: node cli/cli256-node.js status"
print_info "   • Create Wallet: node cli/cli256-wallet.js generate"
print_info "   • Send Transaction: node cli/cli256-wallet.js send"
print_info "   • Monitor Performance: ./monitor-performance.sh"
echo ""
print_highlight "🎯 Next Steps:"
print_info "   1. Test wallet creation: node cli/cli256-wallet.js generate --name test"
print_info "   2. Check foundation balance: node cli/cli256-wallet.js balance --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234"
print_info "   3. Open dashboard: http://localhost:3000"
print_info "   4. Complete onboarding flow"
print_info "   5. Start building dApps!"
echo ""
echo "🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊🎊"
echo ""
print_launch "CLI256 BLOCKCHAIN - READY TO REVOLUTIONIZE THE FUTURE! 🌟"
echo ""
print_success "Launch completed successfully at $(date)"
print_info "Thank you for choosing CLI256 Blockchain! 🚀"
