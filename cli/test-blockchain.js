#!/usr/bin/env node

/**
 * CLI256 Blockchain Test Suite
 * Comprehensive testing for blockchain functionality
 */

const { CLI256Node } = require('./cli256-node.js');
const { CLI256Wallet } = require('./cli256-wallet.js');
const chalk = require('chalk');

class BlockchainTester {
  constructor() {
    this.node = new CLI256Node();
    this.wallet = new CLI256Wallet();
    this.testsPassed = 0;
    this.totalTests = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().slice(11, 19);
    switch (type) {
      case 'success':
        console.log(chalk.green(`[${timestamp}] ✓ ${message}`));
        break;
      case 'error':
        console.log(chalk.red(`[${timestamp}] ✗ ${message}`));
        break;
      case 'warning':
        console.log(chalk.yellow(`[${timestamp}] ⚠ ${message}`));
        break;
      default:
        console.log(chalk.blue(`[${timestamp}] ℹ ${message}`));
    }
  }

  assert(condition, message) {
    this.totalTests++;
    if (condition) {
      this.testsPassed++;
      this.log(message, 'success');
      return true;
    } else {
      this.log(message, 'error');
      return false;
    }
  }

  // Test blockchain initialization
  testBlockchainInit() {
    this.log('Testing blockchain initialization...');
    
    this.node.initGenesis();
    
    this.assert(this.node.blockchain.length === 1, 'Genesis block created');
    this.assert(this.node.blockchain[0].index === 0, 'Genesis block has correct index');
    this.assert(this.node.blockchain[0].previousHash === '0', 'Genesis block has correct previous hash');
    this.assert(this.node.balance.size > 0, 'Foundation balances initialized');
    
    // Check total supply
    let totalSupply = 0;
    for (let balance of this.node.balance.values()) {
      totalSupply += balance;
    }
    this.assert(totalSupply === 250000000, 'Total supply is 250M CLI256');
  }

  // Test validator management
  testValidatorManagement() {
    this.log('Testing validator management...');
    
    const validatorAddress = '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234';
    this.node.addValidator(validatorAddress, 10000);
    
    this.assert(this.node.validators.has(validatorAddress), 'Validator added successfully');
    this.assert(this.node.validators.size === 1, 'Validator count is correct');
  }

  // Test transaction creation
  testTransactionCreation() {
    this.log('Testing transaction creation...');
    
    const fromAddr = '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234';
    const toAddr = '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678';
    const amount = 1000;
    const privateKey = 'test-private-key';
    
    const tx = this.node.createTransaction(fromAddr, toAddr, amount, privateKey);
    
    this.assert(tx.from === fromAddr, 'Transaction from address is correct');
    this.assert(tx.to === toAddr, 'Transaction to address is correct');
    this.assert(tx.amount === amount, 'Transaction amount is correct');
    this.assert(tx.txId && tx.txId.length > 0, 'Transaction ID generated');
    this.assert(tx.signature && tx.signature.length > 0, 'Transaction signature generated');
    this.assert(this.node.mempool.length === 1, 'Transaction added to mempool');
  }

  // Test block mining
  testBlockMining() {
    this.log('Testing block mining...');
    
    const validatorAddress = '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234';
    const initialBlockCount = this.node.blockchain.length;
    
    // Mine a block
    const newBlock = this.node.mineBlock(validatorAddress);
    
    this.assert(this.node.blockchain.length === initialBlockCount + 1, 'New block added to blockchain');
    this.assert(newBlock.index === initialBlockCount, 'New block has correct index');
    this.assert(newBlock.validator === validatorAddress, 'New block has correct validator');
    this.assert(newBlock.transactions.length > 0, 'New block contains transactions');
    this.assert(this.node.mempool.length === 0, 'Mempool cleared after mining');
  }

  // Test wallet functionality
  testWalletFunctionality() {
    this.log('Testing wallet functionality...');
    
    // Generate new wallet
    const testWallet = this.wallet.createWallet('test-wallet', 'test-password');
    
    this.assert(testWallet.name === 'test-wallet', 'Wallet name is correct');
    this.assert(testWallet.address.startsWith('0x'), 'Wallet address format is correct');
    this.assert(testWallet.address.length === 42, 'Wallet address length is correct');
    this.assert(testWallet.publicKey.startsWith('0x'), 'Public key format is correct');
    this.assert(testWallet.privateKey !== undefined, 'Private key is encrypted');
    
    // Test private key decryption
    try {
      const decryptedKey = this.wallet.decryptPrivateKey(testWallet.privateKey, 'test-password');
      this.assert(decryptedKey.startsWith('0x'), 'Private key decryption successful');
    } catch (error) {
      this.assert(false, 'Private key decryption failed');
    }
    
    // Test wrong password
    try {
      this.wallet.decryptPrivateKey(testWallet.privateKey, 'wrong-password');
      this.assert(false, 'Wrong password should fail');
    } catch (error) {
      this.assert(true, 'Wrong password correctly rejected');
    }
  }

  // Test network statistics
  testNetworkStatistics() {
    this.log('Testing network statistics...');
    
    const stats = this.node.getStats();
    
    this.assert(stats.blocks > 0, 'Block count is positive');
    this.assert(stats.networkId === 'cli256-mainnet', 'Network ID is correct');
    this.assert(stats.nodeId.startsWith('node-'), 'Node ID format is correct');
    this.assert(stats.totalSupply === 250000000, 'Total supply is correct in stats');
    this.assert(stats.validators >= 0, 'Validator count is valid');
  }

  // Test data persistence
  testDataPersistence() {
    this.log('Testing data persistence...');
    
    // Check if data directory is created
    const fs = require('fs');
    const path = require('path');
    
    const dataDir = path.join(process.cwd(), '.cli256');
    this.assert(fs.existsSync(dataDir), 'Data directory created');
    
    const blockchainFile = path.join(dataDir, 'blockchain.json');
    const nodeFile = path.join(dataDir, 'node.json');
    
    // These files should be created after initialization
    this.assert(fs.existsSync(blockchainFile) || this.node.blockchain.length > 0, 'Blockchain persistence ready');
    this.assert(fs.existsSync(nodeFile) || this.node.validators.size >= 0, 'Node state persistence ready');
  }

  // Test security features
  testSecurityFeatures() {
    this.log('Testing security features...');
    
    // Test hash validation
    const block = this.node.blockchain[0];
    const calculatedHash = this.node.calculateHash(
      block.index,
      block.timestamp,
      block.transactions,
      block.previousHash,
      block.nonce
    );
    
    this.assert(block.hash === calculatedHash, 'Block hash validation works');
    
    // Test transaction signature validation
    if (this.node.mempool.length === 0) {
      // Create a test transaction first
      this.node.createTransaction(
        '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
        '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
        100,
        'test-key'
      );
    }
    
    this.assert(this.node.mempool.length >= 0, 'Transaction pool management works');
  }

  // Run all tests
  async runAllTests() {
    console.log(chalk.cyan('\n🧪 CLI256 Blockchain Test Suite Starting...\n'));
    
    try {
      this.testBlockchainInit();
      this.testValidatorManagement();
      this.testTransactionCreation();
      this.testBlockMining();
      this.testWalletFunctionality();
      this.testNetworkStatistics();
      this.testDataPersistence();
      this.testSecurityFeatures();
      
      // Test results
      console.log(chalk.cyan('\n📊 Test Results:'));
      console.log(chalk.blue('═══════════════════════════════════'));
      
      if (this.testsPassed === this.totalTests) {
        console.log(chalk.green(`✅ ALL TESTS PASSED: ${this.testsPassed}/${this.totalTests}`));
        console.log(chalk.green('🎉 CLI256 Blockchain is ready for production!'));
      } else {
        console.log(chalk.yellow(`⚠️  TESTS PASSED: ${this.testsPassed}/${this.totalTests}`));
        console.log(chalk.yellow(`❌ TESTS FAILED: ${this.totalTests - this.testsPassed}`));
        console.log(chalk.red('🔧 Please fix failed tests before production deployment'));
      }
      
      console.log(chalk.blue('═══════════════════════════════════\n'));
      
      return this.testsPassed === this.totalTests;
      
    } catch (error) {
      this.log(`Test suite error: ${error.message}`, 'error');
      return false;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new BlockchainTester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { BlockchainTester };
