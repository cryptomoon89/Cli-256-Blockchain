# CLI256 Developer Setup & Deployment Guide

## 🔐 Developer Access Codes

### Access Levels & Codes

| Level | Access Code | Permissions | Description |
|-------|-------------|-------------|-------------|
| **Admin** | `CLI256-PRIME-DEV-2024` | Full system control | Primary developer access |
| **Senior** | `CLI256-SENIOR-ACCESS-7891` | System monitoring & operations | Senior developer access |
| **Junior** | `CLI256-JUNIOR-READ-4567` | Read-only operations | Junior developer access |
| **Emergency** | `CLI256-EMERGENCY-OVERRIDE-9999` | Emergency system control | Emergency access only |

### Security Configuration
- **Max Login Attempts**: 3
- **Lockout Duration**: 1 hour  
- **2FA Required**: Yes (future implementation)
- **Access Logging**: All access attempts logged
- **Code Expiration**: Various dates (see `code-access/dev-access-codes.json`)

## 🏗️ CLI Blockchain System Setup

### Prerequisites
```bash
# Install Node.js (v14 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install required packages
npm install -g commander chalk ora inquirer qrcode
```

### Quick Setup (5 minutes)
```bash
# 1. Setup CLI tools
chmod +x setup-cli.sh
./setup-cli.sh

# 2. Install CLI dependencies
cd cli
npm install

# 3. Make CLI tools executable
chmod +x cli256-node.js
chmod +x cli256-wallet.js

# 4. Test installation
./cli256-node.js --help
./cli256-wallet.js --help
```

## 🚀 Running the CLI256 Blockchain

### Step 1: Initialize Blockchain
```bash
cd cli
./cli256-node.js init
```
**Output:**
```
🔧 Initializing CLI256 Blockchain...
✓ Genesis block created
  Hash: 0x1a2b3c4d5e6f7890abcdef...
  Total Supply: 250,000,000 CLI256
✅ Blockchain initialized successfully
```

### Step 2: Start Validator Node
```bash
./cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 --port 8080
```
**Output:**
```
🚀 CLI256 Node Starting...
   Network: cli256-mainnet
   Node ID: node-a1b2c3d4e5f6g7h8
   Consensus: PoA
✓ Validator added: 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
  Stake: 10000 CLI256
  Total Validators: 1
📊 Node Status:
   Listening on port: 8080
   Blockchain height: 1
   Active validators: 1
   Mempool size: 0
```

### Step 3: Create & Manage Wallets
```bash
# Generate new wallet
./cli256-wallet.js generate --name devWallet

# Check balance
./cli256-wallet.js balance

# Send transaction  
./cli256-wallet.js send --to 0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12 --amount 100
```

### Step 4: Monitor Blockchain
```bash
# Check node status
./cli256-node.js status

# View recent blocks
./cli256-node.js blockchain --blocks 5

# List validators
./cli256-node.js validator list

# Network information
./cli256-node.js network info
```

## 🖥️ Web Dashboard Access

### Developer Dashboard
1. **Navigate to**: `http://localhost:3000/developer`
2. **Enter Access Code**: Use one of the access codes above
3. **Access Level**: Based on the code used

### Blockchain Manager
1. **Navigate to**: `http://localhost:3000/blockchain`
2. **View**: Token distribution, network stats, validator status
3. **Manage**: System configuration and monitoring

### Main Dashboard
1. **Navigate to**: `http://localhost:3000/`
2. **View**: Real-time network overview
3. **Access**: Public blockchain statistics

## 🛠️ CLI Commands Reference

### Node Management
```bash
# Initialize blockchain
./cli256-node.js init

# Start node
./cli256-node.js start [--validator ADDRESS] [--port PORT]

# Stop node
./cli256-node.js stop

# Node status
./cli256-node.js status

# Blockchain info
./cli256-node.js blockchain [--blocks COUNT]

# Network operations
./cli256-node.js network info|peers|sync

# Validator management
./cli256-node.js validator add|list|remove ADDRESS

# Export data
./cli256-node.js export [--format FORMAT] [--output FILE]
```

### Wallet Operations
```bash
# Generate wallet
./cli256-wallet.js generate [--name NAME] [--output FILE]

# Import wallet
./cli256-wallet.js import [--name NAME] [--key KEY] [--file FILE]

# Check balance
./cli256-wallet.js balance [--address ADDRESS]

# Send transaction
./cli256-wallet.js send [--to ADDRESS] [--amount AMOUNT] [--from ADDRESS]

# List wallets
./cli256-wallet.js list

# Generate QR code
./cli256-wallet.js qrcode [--address ADDRESS]

# Transaction history
./cli256-wallet.js history [--address ADDRESS] [--limit COUNT]

# Export wallet
./cli256-wallet.js export [--name NAME] [--output FILE]
```

## 🔄 Automation Scripts

### Auto-Monitor Script
```bash
#!/bin/bash
# monitor-cli256.sh

while true; do
  clear
  echo "=== CLI256 LIVE MONITOR ==="
  ./cli256-node.js status
  echo ""
  echo "=== RECENT BLOCKS ==="
  ./cli256-node.js blockchain --blocks 3
  echo ""
  echo "=== MEMPOOL ==="
  echo "Pending transactions: $(./cli256-node.js status | grep 'Mempool Size' | awk '{print $3}')"
  sleep 5
done
```

### Balance Checker Script
```bash
#!/bin/bash
# check-balances.sh

FOUNDATION="0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234"
DEVELOPMENT="0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678"
VALIDATORS="0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901"

echo "=== CLI256 TOKEN BALANCES ==="
echo "Foundation: $(./cli256-wallet.js balance --address $FOUNDATION)"
echo "Development: $(./cli256-wallet.js balance --address $DEVELOPMENT)"
echo "Validators: $(./cli256-wallet.js balance --address $VALIDATORS)"
```

## 🧪 Testing & Validation

### Functional Tests
```bash
# Test blockchain initialization
./cli256-node.js init
echo "✓ Blockchain initialized"

# Test wallet generation
./cli256-wallet.js generate --name test
echo "✓ Wallet generated"

# Test transaction creation
./cli256-wallet.js send --to 0x123... --amount 1
echo "✓ Transaction created"

# Test balance checking
./cli256-wallet.js balance
echo "✓ Balance retrieved"
```

### Performance Tests
```bash
# Stress test transaction creation
for i in {1..100}; do
  ./cli256-wallet.js send --to 0x456... --amount 1
done

# Monitor block production
watch -n 1 './cli256-node.js status'
```

## 🔐 Security Implementation

### Private Key Management
- **Foundation Wallet**: Secured with multi-sig (3-of-5)
- **Development Wallet**: Hardware wallet + biometric access
- **Validator Keys**: Distributed across secure locations
- **Emergency Keys**: Cold storage with geographic distribution

### Access Control Matrix

| Operation | Admin | Senior | Junior | Emergency |
|-----------|-------|--------|--------|-----------|
| Start/Stop Node | ✅ | ✅ | ❌ | ✅ |
| Mint Tokens | ✅ | ❌ | ❌ | ✅ |
| Add Validator | ✅ | ✅ | ❌ | ✅ |
| System Logs | ✅ | ✅ | ✅ | ✅ |
| Network Config | ✅ | ❌ | ❌ | ✅ |
| Emergency Stop | ✅ | ❌ | ❌ | ✅ |

### Audit Trail
All operations are logged with:
- **Timestamp**: UTC timestamp
- **User**: Access level and identifier  
- **Action**: Command executed
- **Result**: Success/failure status
- **IP Address**: Source of request
- **Session**: Unique session identifier

## 🚨 Emergency Procedures

### Network Emergency Stop
```bash
# Use emergency access code
# Login to developer dashboard
# Execute emergency stop command
./cli256-node.js network emergency-stop
```

### Validator Rotation
```bash
# Remove compromised validator
./cli256-node.js validator remove 0xCompromisedAddress

# Add new validator
./cli256-node.js validator add 0xNewSecureAddress
```

### Backup & Recovery
```bash
# Create full backup
./cli256-node.js export --format json --output emergency-backup

# Restore from backup
./cli256-node.js import --file emergency-backup.json
```

## 📊 Monitoring & Analytics

### Real-time Metrics
- **Block Height**: Current blockchain height
- **Transaction Volume**: TPS and total transactions
- **Validator Status**: Active validators and performance
- **Network Health**: Consensus status and peer connectivity
- **Token Distribution**: Real-time balance monitoring

### Dashboard Endpoints
- **Main Dashboard**: `/` - Public network overview
- **Wallet Interface**: `/wallet` - Wallet management
- **Developer Console**: `/developer` - System administration
- **Blockchain Manager**: `/blockchain` - Network administration

---

## 🎯 Next Steps

1. **Setup CLI Tools**: Run setup script
2. **Initialize Network**: Create genesis block
3. **Start Validator**: Begin block production
4. **Create Wallets**: Generate development wallets
5. **Test Transactions**: Validate transaction flow
6. **Monitor Network**: Use dashboard and CLI monitoring
7. **Scale Network**: Add additional validators
8. **Deploy Smart Contracts**: Implement additional functionality

For support and issues, use the developer dashboard or check logs in the CLI output.

**Happy CLI256 Blockchain Development!** 🚀
