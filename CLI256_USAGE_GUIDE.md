# CLI256 Blockchain - Complete CLI Usage Guide

## 🚀 Getting Started

### Prerequisites
```bash
# Install Node.js dependencies
npm install commander chalk ora inquirer qrcode

# Make CLI tools executable
chmod +x cli/cli256-node.js
chmod +x cli/cli256-wallet.js

# Optional: Add to PATH for global access
export PATH=$PATH:$(pwd)/cli
```

### Quick Start (5 Minutes Setup)
```bash
# 1. Initialize blockchain
./cli/cli256-node.js init

# 2. Start node as validator
./cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# 3. Generate wallet (in new terminal)
./cli/cli256-wallet.js generate --name myWallet

# 4. Check balance
./cli/cli256-wallet.js balance

# 5. Send transaction
./cli/cli256-wallet.js send --to 0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12 --amount 100
```

## 🏗️ Node Management Commands

### Initialize Blockchain
```bash
# Create genesis block with initial token distribution
./cli/cli256-node.js init
```

### Start/Stop Node
```bash
# Start regular node
./cli/cli256-node.js start --port 8080

# Start as validator
./cli/cli256-node.js start --validator 0xYourValidatorAddress --port 8080

# Stop node
./cli/cli256-node.js stop
```

### Node Status & Monitoring
```bash
# Check node status
./cli/cli256-node.js status

# View blockchain info
./cli/cli256-node.js blockchain --blocks 10

# Network information
./cli/cli256-node.js network info
./cli/cli256-node.js network peers
./cli/cli256-node.js network sync
```

### Validator Management
```bash
# Add validator
./cli/cli256-node.js validator add 0xValidatorAddress

# List validators
./cli/cli256-node.js validator list

# Remove validator (future feature)
./cli/cli256-node.js validator remove 0xValidatorAddress
```

### Data Export
```bash
# Export blockchain data
./cli/cli256-node.js export --format json --output blockchain-backup

# Export with timestamp
./cli/cli256-node.js export --format csv --output daily-export
```

## 💰 Wallet Commands

### Create & Import Wallets
```bash
# Generate new wallet
./cli/cli256-wallet.js generate --name primaryWallet --output wallet.json

# Import from private key
./cli/cli256-wallet.js import --name importedWallet --key 0xPrivateKey

# Import from file
./cli/cli256-wallet.js import --file wallet.json
```

### Balance & Address Management
```bash
# Check current wallet balance
./cli/cli256-wallet.js balance

# Check specific address balance
./cli/cli256-wallet.js balance --address 0xSpecificAddress

# Generate QR code for receiving
./cli/cli256-wallet.js qrcode
./cli/cli256-wallet.js qrcode --address 0xSpecificAddress
```

### Send Transactions
```bash
# Interactive send (prompts for details)
./cli/cli256-wallet.js send

# Direct send
./cli/cli256-wallet.js send --to 0xRecipient --amount 500

# Send from specific address
./cli/cli256-wallet.js send --from 0xSender --to 0xRecipient --amount 100
```

### Wallet Management
```bash
# List all wallets
./cli/cli256-wallet.js list

# Export wallet
./cli/cli256-wallet.js export --name walletName --output backup.json

# Transaction history
./cli/cli256-wallet.js history --limit 20
./cli/cli256-wallet.js history --address 0xSpecificAddress
```

## 🔧 Advanced Usage Examples

### 1. Complete Node Setup
```bash
# Terminal 1: Initialize and start validator node
./cli/cli256-node.js init
./cli/cli256-node.js validator add 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
./cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Terminal 2: Monitor blockchain
watch ./cli/cli256-node.js status

# Terminal 3: Wallet operations
./cli/cli256-wallet.js generate --name validator
./cli/cli256-wallet.js balance
```

### 2. Multi-Wallet Setup
```bash
# Create multiple wallets
./cli/cli256-wallet.js generate --name personal
./cli/cli256-wallet.js generate --name business  
./cli/cli256-wallet.js generate --name savings

# List all wallets
./cli/cli256-wallet.js list

# Send between wallets
./cli/cli256-wallet.js send --to 0xBusinessWalletAddress --amount 1000
```

### 3. Network Synchronization
```bash
# Start node and sync with network
./cli/cli256-node.js start --port 8080
./cli/cli256-node.js network sync

# Add peer connections
./cli/cli256-node.js network peers

# Monitor synchronization
./cli/cli256-node.js blockchain --blocks 5
```

### 4. Token Distribution Verification
```bash
# Check foundation addresses
./cli/cli256-wallet.js balance --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234  # Foundation
./cli/cli256-wallet.js balance --address 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678  # Development
./cli/cli256-wallet.js balance --address 0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901  # Validators
./cli/cli256-wallet.js balance --address 0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12  # Public
./cli/cli256-wallet.js balance --address 0x789c90Aa0987E4876169f7gJ82I1A1e4a0H1B23  # Ecosystem
```

## 🔐 Security Best Practices

### Wallet Security
```bash
# Always use strong passwords
./cli/cli256-wallet.js generate
# Enter secure password when prompted

# Backup wallets securely
./cli/cli256-wallet.js export --output secure-backup.json
# Store backup in secure location

# Never share private keys
# Use password protection for all operations
```

### Node Security
```bash
# Run validator with secure configuration
./cli/cli256-node.js start --validator 0xSecureAddress --port 8080

# Regular blockchain exports
./cli/cli256-node.js export --output daily-backup-$(date +%Y%m%d)

# Monitor network status
./cli/cli256-node.js network info
```

## 📊 Monitoring & Analytics

### Real-time Monitoring Script
```bash
#!/bin/bash
# monitor.sh - Real-time CLI256 monitoring

while true; do
  clear
  echo "=== CLI256 NETWORK STATUS ==="
  ./cli/cli256-node.js status
  echo ""
  echo "=== RECENT BLOCKS ==="
  ./cli/cli256-node.js blockchain --blocks 3
  echo ""
  echo "=== VALIDATOR STATUS ==="
  ./cli/cli256-node.js validator list
  sleep 10
done
```

### Balance Monitoring
```bash
#!/bin/bash
# balance-monitor.sh

ADDRESSES=(
  "0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234"  # Foundation
  "0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678"  # Development
  "0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901"  # Validators
)

for addr in "${ADDRESSES[@]}"; do
  echo "Checking balance for: $addr"
  ./cli/cli256-wallet.js balance --address $addr
  echo ""
done
```

## 🐛 Troubleshooting

### Common Issues

#### Node Won't Start
```bash
# Check if port is in use
lsof -i :8080

# Initialize if not done
./cli/cli256-node.js init

# Check logs
./cli/cli256-node.js status
```

#### Wallet Password Issues
```bash
# Cannot decrypt wallet
# Solution: Ensure correct password, no recovery possible

# Wallet file corrupted
# Solution: Use backup wallet file
./cli/cli256-wallet.js import --file backup.json
```

#### Transaction Failures
```bash
# Insufficient balance
./cli/cli256-wallet.js balance

# Invalid address format
# Ensure address starts with 0x and is 42 characters

# Network connectivity
./cli/cli256-node.js network info
```

### Debug Mode
```bash
# Add debug output (future feature)
DEBUG=cli256 ./cli/cli256-node.js start
DEBUG=cli256 ./cli/cli256-wallet.js send
```

## 🔄 Automation Scripts

### Auto-Backup Script
```bash
#!/bin/bash
# auto-backup.sh - Daily blockchain backup

DATE=$(date +%Y%m%d)
BACKUP_DIR="./backups/$DATE"

mkdir -p $BACKUP_DIR

# Backup blockchain
./cli/cli256-node.js export --output "$BACKUP_DIR/blockchain-$DATE"

# Backup wallets
./cli/cli256-wallet.js list > "$BACKUP_DIR/wallet-list-$DATE.txt"

echo "Backup completed: $BACKUP_DIR"
```

### Health Check Script
```bash
#!/bin/bash
# healthcheck.sh - System health monitoring

echo "=== CLI256 HEALTH CHECK ==="

# Check if node is running
if ./cli/cli256-node.js status | grep -q "Running"; then
  echo "✅ Node Status: Running"
else
  echo "❌ Node Status: Stopped"
fi

# Check validator count
VALIDATORS=$(./cli/cli256-node.js validator list | grep -c "0x")
echo "👥 Active Validators: $VALIDATORS"

# Check recent blocks
LATEST_BLOCK=$(./cli/cli256-node.js status | grep "Block Height" | awk '{print $3}')
echo "🔗 Latest Block: $LATEST_BLOCK"

echo "=== HEALTH CHECK COMPLETE ==="
```

## 📡 API Integration (Future)

### REST API Endpoints
```bash
# Future API endpoints for integration
curl http://localhost:8080/api/status
curl http://localhost:8080/api/balance/0xAddress
curl -X POST http://localhost:8080/api/transaction
```

### WebSocket Monitoring
```bash
# Real-time updates (future feature)
wscat -c ws://localhost:8080/ws/blocks
wscat -c ws://localhost:8080/ws/transactions
```

---

## 🎯 Command Reference Quick Guide

### Node Commands
| Command | Description |
|---------|-------------|
| `init` | Initialize blockchain |
| `start` | Start node |
| `stop` | Stop node |
| `status` | Node status |
| `blockchain` | View blockchain |
| `validator` | Manage validators |
| `network` | Network operations |
| `export` | Export data |

### Wallet Commands
| Command | Description |
|---------|-------------|
| `generate` | Create new wallet |
| `import` | Import wallet |
| `balance` | Check balance |
| `send` | Send transaction |
| `list` | List wallets |
| `qrcode` | Generate QR code |
| `history` | Transaction history |
| `export` | Export wallet |

For more help on any command, use `--help`:
```bash
./cli/cli256-node.js --help
./cli/cli256-wallet.js send --help
```

🚀 **Happy CLI256 Blockchain Development!**
