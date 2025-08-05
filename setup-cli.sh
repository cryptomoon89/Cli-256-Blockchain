#!/bin/bash

# CLI256 Blockchain Setup Script
# This script sets up the CLI256 blockchain tools for development

echo "🚀 CLI256 Blockchain Setup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Navigate to CLI directory
cd cli

# Install dependencies
echo "📦 Installing CLI dependencies..."
npm install

# Make CLI scripts executable
echo "🔧 Setting up executable permissions..."
chmod +x cli256-node.js
chmod +x cli256-wallet.js

# Test CLI tools
echo "🧪 Testing CLI tools..."
if ./cli256-node.js --help &> /dev/null; then
    echo "✅ CLI256 Node CLI: Working"
else
    echo "❌ CLI256 Node CLI: Failed"
fi

if ./cli256-wallet.js --help &> /dev/null; then
    echo "✅ CLI256 Wallet CLI: Working"  
else
    echo "❌ CLI256 Wallet CLI: Failed"
fi

# Create demo script
cat > demo.js << 'EOF'
#!/usr/bin/env node

/**
 * CLI256 Blockchain Demo
 * Quick demonstration of CLI256 blockchain functionality
 */

const chalk = require('chalk');
const { spawn } = require('child_process');

console.log(chalk.cyan('🎮 CLI256 Blockchain Demo'));
console.log(chalk.blue('============================'));

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function demo() {
  try {
    console.log(chalk.yellow('\n1. Initializing blockchain...'));
    await runCommand('./cli256-node.js', ['init']);
    
    console.log(chalk.yellow('\n2. Generating wallet...'));
    await runCommand('./cli256-wallet.js', ['generate', '--name', 'demo']);
    
    console.log(chalk.yellow('\n3. Checking node status...'));
    await runCommand('./cli256-node.js', ['status']);
    
    console.log(chalk.green('\n✅ Demo completed successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.blue('- Start node: ./cli256-node.js start --validator 0xYourAddress'));
    console.log(chalk.blue('- Check balance: ./cli256-wallet.js balance'));
    console.log(chalk.blue('- Send transaction: ./cli256-wallet.js send'));
    
  } catch (error) {
    console.log(chalk.red('❌ Demo failed:', error.message));
  }
}

demo();
EOF

chmod +x demo.js

# Create aliases for easier access
echo ""
echo "🔗 Setting up aliases..."
echo "You can add these to your ~/.bashrc or ~/.zshrc:"
echo ""
echo "alias cli256-node='$(pwd)/cli256-node.js'"
echo "alias cli256-wallet='$(pwd)/cli256-wallet.js'"
echo ""

# Create quick start guide
cat > QUICK_START.md << 'EOF'
# CLI256 Quick Start Guide

## 🚀 Getting Started (2 minutes)

### 1. Initialize Blockchain

./cli256-node.js init
```

### 2. Start Node
```bash
# Start as validator
./cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Or start regular node
./cli256-node.js start
```

### 3. Create Wallet
```bash
./cli256-wallet.js generate --name myWallet
```

### 4. Check Balance
```bash
./cli256-wallet.js balance
```

### 5. Send Transaction
```bash
./cli256-wallet.js send --to 0xRecipientAddress --amount 100
```

## 📊 Monitoring

```bash
# Node status
./cli256-node.js status

# Blockchain info
./cli256-node.js blockchain --blocks 5

# Wallet list
./cli256-wallet.js list
```

## 🛠️ Advanced Usage

See `../CLI256_USAGE_GUIDE.md` for complete documentation.

## 🎮 Demo

Run the demo script to see everything in action:
```bash
node demo.js
```
EOF

echo "📖 Quick start guide created: cli/QUICK_START.md"

# Set up path for current session
export PATH=$PATH:$(pwd)

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: ./cli/QUICK_START.md"
echo "   - Full Guide: ./CLI256_USAGE_GUIDE.md"
echo ""
echo "🎮 Run demo:"
echo "   cd cli && node demo.js"
echo ""
echo "🚀 Start blockchain:"
echo "   cd cli && ./cli256-node.js init && ./cli256-node.js start"
echo ""
echo "💰 Create wallet:"
echo "   cd cli && ./cli256-wallet.js generate"
echo ""
echo "Happy CLI256 development! 🚀"

cd ..
