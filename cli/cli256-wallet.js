#!/usr/bin/env node

/**
 * CLI256 Wallet CLI
 * Command-line wallet for CLI256 blockchain
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const QRCode = require('qrcode');

const program = new Command();

// CLI256 Wallet Class
class CLI256Wallet {
  constructor() {
    this.wallets = new Map();
    this.currentWallet = null;
    this.nodeUrl = 'http://localhost:8080';
    this.networkId = 'cli256-mainnet';
    this.dataDir = path.join(process.cwd(), '.cli256');
    this.walletDir = path.join(this.dataDir, 'wallets');
    this.ensureDataDir();
  }

  // Ensure data directory exists
  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.walletDir)) {
      fs.mkdirSync(this.walletDir, { recursive: true });
    }
  }

  // Generate new keypair
  generateKeypair() {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    const address = '0x' + crypto.createHash('sha256').update(publicKey).digest('hex').slice(0, 40);
    
    return {
      privateKey: '0x' + privateKey,
      publicKey: '0x' + publicKey,
      address
    };
  }

  // Create new wallet
  createWallet(name, password) {
    const keypair = this.generateKeypair();
    const encryptedPrivateKey = this.encryptPrivateKey(keypair.privateKey, password);
    
    const wallet = {
      name,
      address: keypair.address,
      publicKey: keypair.publicKey,
      privateKey: encryptedPrivateKey,
      created: new Date().toISOString(),
      balance: 0,
      nonce: 0
    };
    
    this.wallets.set(name, wallet);
    this.currentWallet = wallet;
    
    return wallet;
  }

  // Encrypt private key with password
  encryptPrivateKey(privateKey, password) {
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipherGCM('aes-256-gcm', key, iv);

    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Decrypt private key with password
  decryptPrivateKey(encryptedData, password) {
    try {
      const key = crypto.scryptSync(password, 'salt', 32);

      // Handle legacy format
      if (typeof encryptedData === 'string') {
        const decipher = crypto.createDecipher('aes-256-cbc', password);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      }

      // New secure format
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const authTag = Buffer.from(encryptedData.authTag, 'hex');
      const decipher = crypto.createDecipherGCM('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Invalid password or corrupted wallet data');
    }
  }

  // Import wallet from private key
  importWallet(name, privateKey, password) {
    const publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    const address = '0x' + crypto.createHash('sha256').update(publicKey).digest('hex').slice(0, 40);
    const encryptedPrivateKey = this.encryptPrivateKey(privateKey, password);
    
    const wallet = {
      name,
      address,
      publicKey: '0x' + publicKey,
      privateKey: encryptedPrivateKey,
      created: new Date().toISOString(),
      balance: 0,
      nonce: 0,
      imported: true
    };
    
    this.wallets.set(name, wallet);
    this.currentWallet = wallet;
    
    return wallet;
  }

  // Save wallet to file
  saveWallet(wallet, filepath) {
    const walletData = {
      ...wallet,
      version: '1.0.0',
      network: this.networkId
    };
    
    fs.writeFileSync(filepath, JSON.stringify(walletData, null, 2));
    console.log(chalk.green(`✓ Wallet saved to: ${filepath}`));
  }

  // Load wallet from file
  loadWallet(filepath) {
    if (!fs.existsSync(filepath)) {
      throw new Error('Wallet file not found');
    }
    
    const walletData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    this.wallets.set(walletData.name, walletData);
    this.currentWallet = walletData;
    
    return walletData;
  }

  // Get wallet balance (mock - in real implementation, query blockchain)
  async getBalance(address) {
    // Mock balance lookup
    const mockBalances = {
      '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234': 50000000,
      '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678': 37500000,
      '0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901': 75000000,
      '0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12': 62500000,
      '0x789c90Aa0987E4876169f7gJ82I1A1e4a0H1B23': 25000000
    };
    
    return mockBalances[address] || Math.floor(Math.random() * 10000);
  }

  // Create and sign transaction
  createTransaction(from, to, amount, password) {
    const wallet = this.wallets.get(this.currentWallet?.name);
    if (!wallet) {
      throw new Error('No active wallet');
    }
    
    const privateKey = this.decryptPrivateKey(wallet.privateKey, password);
    const timestamp = Date.now();
    const nonce = wallet.nonce + 1;
    
    const txData = {
      from,
      to,
      amount: parseFloat(amount),
      timestamp,
      nonce
    };
    
    // Sign transaction
    const signature = crypto
      .createHmac('sha256', privateKey)
      .update(JSON.stringify(txData))
      .digest('hex');
    
    const transaction = {
      ...txData,
      signature,
      txId: crypto.randomBytes(16).toString('hex')
    };
    
    // Update wallet nonce
    wallet.nonce = nonce;
    
    return transaction;
  }

  // Generate QR code for address
  async generateQRCode(address) {
    try {
      const qrCodeData = await QRCode.toString(address, { type: 'terminal' });
      return qrCodeData;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }
}

// Global wallet instance
const wallet = new CLI256Wallet();

// CLI Commands
program
  .name('cli256-wallet')
  .description('CLI256 Blockchain Wallet')
  .version('1.0.0');

// Generate new wallet
program
  .command('generate')
  .description('Generate new CLI256 wallet')
  .option('-n, --name <name>', 'Wallet name', 'default')
  .option('-o, --output <file>', 'Output file for wallet')
  .action(async (options) => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Enter wallet password:',
          mask: '*'
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm password:',
          mask: '*'
        }
      ]);
      
      if (answers.password !== answers.confirmPassword) {
        console.log(chalk.red('❌ Passwords do not match'));
        return;
      }
      
      console.log(chalk.cyan('🔑 Generating new CLI256 wallet...'));
      
      const newWallet = wallet.createWallet(options.name, answers.password);
      
      console.log(chalk.green('\n✅ Wallet generated successfully!'));
      console.log(chalk.blue('══════════════════════════════════'));
      console.log(chalk.green(`Name: ${newWallet.name}`));
      console.log(chalk.green(`Address: ${newWallet.address}`));
      console.log(chalk.green(`Public Key: ${newWallet.publicKey}`));
      console.log(chalk.yellow('⚠️  Private Key: [ENCRYPTED - Use password to access]'));
      console.log(chalk.blue('══════════════════════════════════'));
      console.log(chalk.red('🔒 KEEP YOUR PASSWORD SAFE - IT CANNOT BE RECOVERED!'));
      
      if (options.output) {
        wallet.saveWallet(newWallet, options.output);
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// Import existing wallet
program
  .command('import')
  .description('Import wallet from private key')
  .option('-n, --name <name>', 'Wallet name', 'imported')
  .option('-k, --key <privateKey>', 'Private key to import')
  .option('-f, --file <file>', 'Import from wallet file')
  .action(async (options) => {
    try {
      if (options.file) {
        // Import from file
        const loadedWallet = wallet.loadWallet(options.file);
        console.log(chalk.green(`✅ Wallet loaded: ${loadedWallet.name}`));
        console.log(chalk.blue(`   Address: ${loadedWallet.address}`));
        return;
      }
      
      if (!options.key) {
        const keyAnswer = await inquirer.prompt([
          {
            type: 'password',
            name: 'privateKey',
            message: 'Enter private key:',
            mask: '*'
          }
        ]);
        options.key = keyAnswer.privateKey;
      }
      
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Enter new wallet password:',
          mask: '*'
        }
      ]);
      
      const importedWallet = wallet.importWallet(options.name, options.key, answers.password);
      
      console.log(chalk.green('\n✅ Wallet imported successfully!'));
      console.log(chalk.blue('════════════════════════════'));
      console.log(chalk.green(`Name: ${importedWallet.name}`));
      console.log(chalk.green(`Address: ${importedWallet.address}`));
      console.log(chalk.blue('═���══════════════════════════'));
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// Check balance
program
  .command('balance')
  .description('Check wallet balance')
  .option('-a, --address <address>', 'Check specific address balance')
  .action(async (options) => {
    try {
      let address = options.address;
      
      if (!address && wallet.currentWallet) {
        address = wallet.currentWallet.address;
      }
      
      if (!address) {
        console.log(chalk.red('❌ No wallet loaded and no address specified'));
        return;
      }
      
      console.log(chalk.cyan('💰 Checking balance...'));
      const balance = await wallet.getBalance(address);
      
      console.log(chalk.green('\n💰 Balance Information'));
      console.log(chalk.blue('═══════════════════════'));
      console.log(chalk.green(`Address: ${address}`));
      console.log(chalk.green(`Balance: ${balance.toLocaleString()} CLI256`));
      console.log(chalk.blue(`USD Value: $${(balance * 2.85).toLocaleString()}`)); // Mock price
      console.log(chalk.blue('═══════════════════════'));
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// Send transaction
program
  .command('send')
  .description('Send CLI256 tokens')
  .option('-t, --to <address>', 'Recipient address')
  .option('-a, --amount <amount>', 'Amount to send')
  .option('-f, --from <address>', 'Sender address (current wallet if not specified)')
  .action(async (options) => {
    try {
      if (!wallet.currentWallet) {
        console.log(chalk.red('❌ No active wallet. Please generate or import a wallet first.'));
        return;
      }
      
      if (!options.to || !options.amount) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'to',
            message: 'Recipient address:',
            when: !options.to
          },
          {
            type: 'input',
            name: 'amount',
            message: 'Amount to send:',
            when: !options.amount,
            validate: (input) => !isNaN(input) && parseFloat(input) > 0
          },
          {
            type: 'password',
            name: 'password',
            message: 'Enter wallet password:',
            mask: '*'
          }
        ]);
        
        options.to = options.to || answers.to;
        options.amount = options.amount || answers.amount;
        options.password = answers.password;
      }
      
      const fromAddress = options.from || wallet.currentWallet.address;
      
      console.log(chalk.cyan('📤 Creating transaction...'));
      
      const transaction = wallet.createTransaction(
        fromAddress,
        options.to,
        options.amount,
        options.password
      );
      
      console.log(chalk.green('\n✅ Transaction created successfully!'));
      console.log(chalk.blue('════════════════════════════════'));
      console.log(chalk.green(`TX ID: ${transaction.txId}`));
      console.log(chalk.blue(`From: ${transaction.from}`));
      console.log(chalk.blue(`To: ${transaction.to}`));
      console.log(chalk.blue(`Amount: ${transaction.amount} CLI256`));
      console.log(chalk.blue(`Timestamp: ${new Date(transaction.timestamp).toISOString()}`));
      console.log(chalk.blue('════════════════════════════════'));
      console.log(chalk.yellow('📡 Broadcasting to network...'));
      
      // Mock broadcast delay
      setTimeout(() => {
        console.log(chalk.green('✅ Transaction broadcasted successfully!'));
        console.log(chalk.blue('⏳ Waiting for confirmation...'));
      }, 2000);
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// List wallets
program
  .command('list')
  .description('List all wallets')
  .action(() => {
    console.log(chalk.cyan('\n👛 CLI256 Wallets'));
    console.log(chalk.blue('═════════════════'));
    
    if (wallet.wallets.size === 0) {
      console.log(chalk.yellow('No wallets found'));
      return;
    }
    
    wallet.wallets.forEach((w, name) => {
      const isActive = wallet.currentWallet?.name === name;
      const indicator = isActive ? chalk.green('● ') : chalk.gray('○ ');
      
      console.log(`${indicator}${chalk.blue(name)}`);
      console.log(`  ${chalk.gray('Address:')} ${w.address}`);
      console.log(`  ${chalk.gray('Created:')} ${new Date(w.created).toLocaleDateString()}`);
      if (w.imported) {
        console.log(`  ${chalk.yellow('[IMPORTED]')}`);
      }
      console.log('');
    });
  });

// Generate QR code for address
program
  .command('qrcode')
  .description('Generate QR code for wallet address')
  .option('-a, --address <address>', 'Address to generate QR code for')
  .action(async (options) => {
    try {
      let address = options.address;
      
      if (!address && wallet.currentWallet) {
        address = wallet.currentWallet.address;
      }
      
      if (!address) {
        console.log(chalk.red('❌ No wallet loaded and no address specified'));
        return;
      }
      
      console.log(chalk.cyan('📱 Generating QR code...'));
      const qrCode = await wallet.generateQRCode(address);
      
      console.log(chalk.green('\n📱 QR Code for Address:'));
      console.log(chalk.blue(`Address: ${address}`));
      console.log('\n' + qrCode);
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// Transaction history
program
  .command('history')
  .description('Show transaction history')
  .option('-a, --address <address>', 'Address to check history for')
  .option('-l, --limit <limit>', 'Number of transactions to show', '10')
  .action(async (options) => {
    try {
      let address = options.address;
      
      if (!address && wallet.currentWallet) {
        address = wallet.currentWallet.address;
      }
      
      if (!address) {
        console.log(chalk.red('❌ No wallet loaded and no address specified'));
        return;
      }
      
      // Mock transaction history
      const mockHistory = [
        {
          txId: 'tx123abc',
          type: 'received',
          amount: 1000,
          from: '0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234',
          timestamp: Date.now() - 86400000,
          confirmed: true
        },
        {
          txId: 'tx456def',
          type: 'sent',
          amount: 250,
          to: '0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678',
          timestamp: Date.now() - 172800000,
          confirmed: true
        }
      ];
      
      console.log(chalk.cyan('\n📋 Transaction History'));
      console.log(chalk.blue('══════════════════════════'));
      console.log(chalk.green(`Address: ${address}`));
      console.log(chalk.blue(`Showing last ${options.limit} transactions:\n`));
      
      mockHistory.slice(0, parseInt(options.limit)).forEach((tx, index) => {
        const typeColor = tx.type === 'received' ? chalk.green : chalk.red;
        const typeSymbol = tx.type === 'received' ? '+' : '-';
        const statusIcon = tx.confirmed ? '✅' : '⏳';
        
        console.log(`${index + 1}. ${statusIcon} ${typeColor(tx.type.toUpperCase())}`);
        console.log(`   TX ID: ${tx.txId}`);
        console.log(`   Amount: ${typeSymbol}${tx.amount} CLI256`);
        console.log(`   ${tx.type === 'received' ? 'From' : 'To'}: ${tx.from || tx.to}`);
        console.log(`   Date: ${new Date(tx.timestamp).toLocaleString()}`);
        console.log('');
      });
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

// Export wallet
program
  .command('export')
  .description('Export wallet to file')
  .option('-n, --name <name>', 'Wallet name to export')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      const walletName = options.name || wallet.currentWallet?.name;
      
      if (!walletName) {
        console.log(chalk.red('❌ No wallet specified and no active wallet'));
        return;
      }
      
      const walletToExport = wallet.wallets.get(walletName);
      if (!walletToExport) {
        console.log(chalk.red(`❌ Wallet "${walletName}" not found`));
        return;
      }
      
      const outputFile = options.output || `${walletName}-wallet.json`;
      wallet.saveWallet(walletToExport, outputFile);
      
      console.log(chalk.green(`✅ Wallet "${walletName}" exported successfully`));
      
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
  });

program.parse();

module.exports = { CLI256Wallet, wallet };
