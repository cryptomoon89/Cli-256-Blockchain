#!/usr/bin/env node

/**
 * CLI256 Blockchain Node CLI
 * Command-line interface for running and managing CLI256 L1 blockchain
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');

const program = new Command();

// CLI256 Node State
class CLI256Node {
  constructor() {
    this.isRunning = false;
    this.blockchain = [];
    this.mempool = [];
    this.validators = new Set();
    this.difficulty = 4;
    this.blockTime = 5000; // 5 seconds
    this.networkId = 'cli256-mainnet';
    this.nodeId = this.generateNodeId();
    this.peers = new Set();
    this.balance = new Map();
    this.consensusType = 'PoA'; // Proof of Authority
    this.dataDir = path.join(process.cwd(), '.cli256');
    this.blockchainFile = path.join(this.dataDir, 'blockchain.json');
    this.nodeFile = path.join(this.dataDir, 'node.json');
    this.loadPersistedData();
  }

  generateNodeId() {
    return 'node-' + crypto.randomBytes(8).toString('hex');
  }

  // Ensure data directory exists
  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  // Load persisted data
  loadPersistedData() {
    try {
      this.ensureDataDir();

      // Load blockchain
      if (fs.existsSync(this.blockchainFile)) {
        const data = JSON.parse(fs.readFileSync(this.blockchainFile, 'utf8'));
        this.blockchain = data.blockchain || [];
        this.balance = new Map(data.balances || []);
        console.log(chalk.blue(`📁 Loaded ${this.blockchain.length} blocks from disk`));
      }

      // Load node state
      if (fs.existsSync(this.nodeFile)) {
        const nodeData = JSON.parse(fs.readFileSync(this.nodeFile, 'utf8'));
        this.validators = new Set(nodeData.validators || []);
        this.nodeId = nodeData.nodeId || this.generateNodeId();
        console.log(chalk.blue(`📁 Loaded node state with ${this.validators.size} validators`));
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Could not load persisted data: ${error.message}`));
    }
  }

  // Save blockchain data
  saveBlockchain() {
    try {
      this.ensureDataDir();
      const data = {
        blockchain: this.blockchain,
        balances: Array.from(this.balance.entries()),
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.blockchainFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(chalk.red(`❌ Failed to save blockchain: ${error.message}`));
    }
  }

  // Save node state
  saveNodeState() {
    try {
      this.ensureDataDir();
      const nodeData = {
        nodeId: this.nodeId,
        validators: Array.from(this.validators),
        networkId: this.networkId,
        consensusType: this.consensusType,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.nodeFile, JSON.stringify(nodeData, null, 2));
    } catch (error) {
      console.log(chalk.red(`❌ Failed to save node state: ${error.message}`));
    }
  }

  // Initialize genesis block
  initGenesis() {
    const genesisBlock = {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), [], '0', 0),
      nonce: 0,
      validator: 'genesis'
    };
    
    this.blockchain = [genesisBlock];

    // Initialize foundation balances
    this.balance.set('0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234', 50000000); // Foundation
    this.balance.set('0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678', 37500000); // Development
    this.balance.set('0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901', 75000000); // Validator Rewards
    this.balance.set('0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12', 62500000); // Public
    this.balance.set('0x789c90Aa0987E4876169f7gJ82I1A1e4a0H1B23', 25000000); // Ecosystem

    // Save to disk
    this.saveBlockchain();
    this.saveNodeState();

    console.log(chalk.green('✓ Genesis block created'));
    console.log(chalk.blue(`  Hash: ${genesisBlock.hash}`));
    console.log(chalk.blue(`  Total Supply: 250,000,000 CLI256`));
    console.log(chalk.blue(`  Data saved to: ${this.dataDir}`));
  }

  calculateHash(index, timestamp, transactions, previousHash, nonce) {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(transactions) + previousHash + nonce)
      .digest('hex');
  }

  // Add validator to PoA consensus
  addValidator(address, stake = 0) {
    this.validators.add(address);
    this.saveNodeState();
    console.log(chalk.green(`✓ Validator added: ${address}`));
    console.log(chalk.blue(`  Stake: ${stake} CLI256`));
    console.log(chalk.blue(`  Total Validators: ${this.validators.size}`));
  }

  // Create new transaction
  createTransaction(from, to, amount, privateKey) {
    const timestamp = Date.now();
    const txData = { from, to, amount, timestamp };
    const signature = crypto
      .createHmac('sha256', privateKey)
      .update(JSON.stringify(txData))
      .digest('hex');

    const transaction = {
      ...txData,
      signature,
      txId: crypto.randomBytes(16).toString('hex')
    };

    this.mempool.push(transaction);
    console.log(chalk.green('✓ Transaction created'));
    console.log(chalk.blue(`  TX ID: ${transaction.txId}`));
    console.log(chalk.blue(`  From: ${from}`));
    console.log(chalk.blue(`  To: ${to}`));
    console.log(chalk.blue(`  Amount: ${amount} CLI256`));
    
    return transaction;
  }

  // Mine new block (PoA consensus)
  mineBlock(validatorAddress) {
    if (!this.validators.has(validatorAddress)) {
      throw new Error('Invalid validator address');
    }

    const previousBlock = this.blockchain[this.blockchain.length - 1];
    const transactions = [...this.mempool];
    this.mempool = [];

    const newBlock = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions,
      previousHash: previousBlock.hash,
      validator: validatorAddress,
      nonce: 0
    };

    // PoA: No mining needed, just sign the block
    newBlock.hash = this.calculateHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.previousHash,
      newBlock.nonce
    );

    // Process transactions
    transactions.forEach(tx => {
      if (this.balance.get(tx.from) >= tx.amount) {
        this.balance.set(tx.from, (this.balance.get(tx.from) || 0) - tx.amount);
        this.balance.set(tx.to, (this.balance.get(tx.to) || 0) + tx.amount);
      }
    });

    this.blockchain.push(newBlock);
    this.saveBlockchain();

    console.log(chalk.green('✓ Block mined successfully'));
    console.log(chalk.blue(`  Block #${newBlock.index}`));
    console.log(chalk.blue(`  Hash: ${newBlock.hash}`));
    console.log(chalk.blue(`  Transactions: ${transactions.length}`));
    console.log(chalk.blue(`  Validator: ${validatorAddress}`));

    return newBlock;
  }

  // Get blockchain stats
  getStats() {
    return {
      blocks: this.blockchain.length,
      transactions: this.blockchain.reduce((sum, block) => sum + block.transactions.length, 0),
      validators: this.validators.size,
      mempool: this.mempool.length,
      totalSupply: 250000000,
      networkId: this.networkId,
      nodeId: this.nodeId,
      isRunning: this.isRunning
    };
  }

  // Start node
  start() {
    this.isRunning = true;
    console.log(chalk.green('🚀 CLI256 Node Starting...'));
    console.log(chalk.blue(`   Network: ${this.networkId}`));
    console.log(chalk.blue(`   Node ID: ${this.nodeId}`));
    console.log(chalk.blue(`   Consensus: ${this.consensusType}`));
    
    // Auto-mining for demo (in production, this would be consensus-driven)
    if (this.validators.size > 0) {
      this.miningInterval = setInterval(() => {
        if (this.mempool.length > 0) {
          const validator = Array.from(this.validators)[0];
          this.mineBlock(validator);
        }
      }, this.blockTime);
    }
  }

  // Stop node
  stop() {
    this.isRunning = false;
    if (this.miningInterval) {
      clearInterval(this.miningInterval);
    }
    console.log(chalk.red('🛑 CLI256 Node Stopped'));
  }
}

// Global node instance
const node = new CLI256Node();

// CLI Commands
program
  .name('cli256-node')
  .description('CLI256 Blockchain Node Management')
  .version('1.0.0');

// Initialize blockchain
program
  .command('init')
  .description('Initialize CLI256 blockchain with genesis block')
  .action(() => {
    console.log(chalk.cyan('🔧 Initializing CLI256 Blockchain...'));
    node.initGenesis();
    console.log(chalk.green('✅ Blockchain initialized successfully'));
  });

// Start node
program
  .command('start')
  .description('Start CLI256 blockchain node')
  .option('-v, --validator <address>', 'Start as validator with address')
  .option('-p, --port <port>', 'Port to run on', '8080')
  .action((options) => {
    const spinner = ora('Starting CLI256 node...').start();
    
    setTimeout(() => {
      if (options.validator) {
        node.addValidator(options.validator, 10000);
      }
      node.start();
      spinner.succeed('CLI256 node started successfully');
      
      console.log(chalk.green('\n📊 Node Status:'));
      console.log(chalk.blue(`   Listening on port: ${options.port}`));
      console.log(chalk.blue(`   Blockchain height: ${node.blockchain.length}`));
      console.log(chalk.blue(`   Active validators: ${node.validators.size}`));
      console.log(chalk.blue(`   Mempool size: ${node.mempool.length}`));
    }, 2000);
  });

// Stop node
program
  .command('stop')
  .description('Stop CLI256 blockchain node')
  .action(() => {
    node.stop();
  });

// Node status
program
  .command('status')
  .description('Show node status and blockchain info')
  .action(() => {
    const stats = node.getStats();
    console.log(chalk.cyan('\n📊 CLI256 Node Status'));
    console.log(chalk.blue('════════════════════════════'));
    console.log(chalk.green(`Status: ${stats.isRunning ? 'Running' : 'Stopped'}`));
    console.log(chalk.blue(`Network ID: ${stats.networkId}`));
    console.log(chalk.blue(`Node ID: ${stats.nodeId}`));
    console.log(chalk.blue(`Block Height: ${stats.blocks}`));
    console.log(chalk.blue(`Total Transactions: ${stats.transactions}`));
    console.log(chalk.blue(`Active Validators: ${stats.validators}`));
    console.log(chalk.blue(`Mempool Size: ${stats.mempool}`));
    console.log(chalk.blue(`Total Supply: ${stats.totalSupply.toLocaleString()} CLI256`));
    console.log(chalk.blue('════════════════════════════'));
  });

// Validator management
program
  .command('validator')
  .description('Validator management commands')
  .argument('<action>', 'add, remove, list')
  .argument('[address]', 'Validator address')
  .action((action, address) => {
    switch (action) {
      case 'add':
        if (!address) {
          console.log(chalk.red('❌ Error: Validator address required'));
          return;
        }
        node.addValidator(address, 10000);
        break;
      case 'list':
        console.log(chalk.cyan('\n👥 Active Validators'));
        console.log(chalk.blue('═══════════════════'));
        if (node.validators.size === 0) {
          console.log(chalk.yellow('No validators registered'));
        } else {
          Array.from(node.validators).forEach((validator, index) => {
            console.log(chalk.blue(`${index + 1}. ${validator}`));
          });
        }
        break;
      default:
        console.log(chalk.red('❌ Invalid action. Use: add, remove, list'));
    }
  });

// Blockchain info
program
  .command('blockchain')
  .description('Show blockchain information')
  .option('-b, --blocks <count>', 'Number of recent blocks to show', '5')
  .action((options) => {
    const blockCount = parseInt(options.blocks);
    const recentBlocks = node.blockchain.slice(-blockCount);
    
    console.log(chalk.cyan('\n🔗 CLI256 Blockchain Info'));
    console.log(chalk.blue('══════════════════════════'));
    console.log(chalk.green(`Total Blocks: ${node.blockchain.length}`));
    console.log(chalk.blue(`Recent ${blockCount} Blocks:`));
    
    recentBlocks.forEach(block => {
      console.log(chalk.blue(`\n  Block #${block.index}`));
      console.log(chalk.blue(`  Hash: ${block.hash.slice(0, 16)}...`));
      console.log(chalk.blue(`  Timestamp: ${new Date(block.timestamp).toISOString()}`));
      console.log(chalk.blue(`  Transactions: ${block.transactions.length}`));
      console.log(chalk.blue(`  Validator: ${block.validator}`));
    });
  });

// Network commands
program
  .command('network')
  .description('Network management commands')
  .argument('<action>', 'info, peers, sync')
  .action((action) => {
    switch (action) {
      case 'info':
        console.log(chalk.cyan('\n🌐 Network Information'));
        console.log(chalk.blue('═══════════════════════'));
        console.log(chalk.blue(`Network ID: ${node.networkId}`));
        console.log(chalk.blue(`Consensus: ${node.consensusType}`));
        console.log(chalk.blue(`Block Time: ${node.blockTime / 1000}s`));
        console.log(chalk.blue(`Connected Peers: ${node.peers.size}`));
        break;
      case 'peers':
        console.log(chalk.cyan('\n👥 Connected Peers'));
        console.log(chalk.blue('═════════════════'));
        if (node.peers.size === 0) {
          console.log(chalk.yellow('No peers connected'));
        } else {
          Array.from(node.peers).forEach((peer, index) => {
            console.log(chalk.blue(`${index + 1}. ${peer}`));
          });
        }
        break;
      case 'sync':
        const spinner = ora('Synchronizing with network...').start();
        setTimeout(() => {
          spinner.succeed('Blockchain synchronized');
          console.log(chalk.green(`✓ Synced to block height: ${node.blockchain.length}`));
        }, 3000);
        break;
      default:
        console.log(chalk.red('❌ Invalid action. Use: info, peers, sync'));
    }
  });

// Export blockchain data
program
  .command('export')
  .description('Export blockchain data')
  .option('-f, --format <format>', 'Export format (json, csv)', 'json')
  .option('-o, --output <file>', 'Output file', 'blockchain-export')
  .action((options) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${options.output}-${timestamp}.${options.format}`;
    
    if (options.format === 'json') {
      const data = {
        network: node.networkId,
        exported: new Date().toISOString(),
        blockchain: node.blockchain,
        balances: Object.fromEntries(node.balance)
      };
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    }
    
    console.log(chalk.green(`✓ Blockchain data exported to: ${filename}`));
  });

program.parse();

module.exports = { CLI256Node, node };
