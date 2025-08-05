# CLI256 Blockchain - Layer 1 Proof-of-Authority Network

CLI256 adalah blockchain Layer 1 yang dibangun dari awal dengan konsensus Proof-of-Authority (PoA), dilengkapi dengan dashboard web interaktif, CLI tools untuk node dan wallet management, serta smart contract functionality.

## 🚀 Quick Start

### Instalasi Dependencies

```bash
# Install node dependencies
npm install

# Install CLI dependencies
cd cli && npm install
```

### Menjalankan Dashboard Web

```bash
npm run dev
```

Dashboard akan tersedia di `http://localhost:3000`

### Setup CLI Tools

```bash
# Buat CLI tools executable
chmod +x cli/cli256-node.js
chmod +x cli/cli256-wallet.js

# Link CLI tools secara global (opsional)
npm link ./cli
```

## 🔧 CLI256 Node Commands

### Inisialisasi Blockchain

```bash
# Inisialisasi blockchain dengan genesis block
./cli/cli256-node.js init
```

### Node Management

```bash
# Start node
./cli/cli256-node.js start

# Start node sebagai validator
./cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Start node dengan port custom
./cli/cli256-node.js start --port 8090

# Stop node
./cli/cli256-node.js stop

# Cek status node
./cli/cli256-node.js status
```

### Validator Management

```bash
# Tambah validator baru
./cli/cli256-node.js validator add 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# List semua validator
./cli/cli256-node.js validator list

# Remove validator (implementasi akan ditambahkan)
./cli/cli256-node.js validator remove 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
```

### Blockchain Information

```bash
# Tampilkan informasi blockchain
./cli/cli256-node.js blockchain

# Tampilkan 10 block terakhir
./cli/cli256-node.js blockchain --blocks 10
```

### Network Management

```bash
# Informasi network
./cli/cli256-node.js network info

# List connected peers
./cli/cli256-node.js network peers

# Sinkronisasi dengan network
./cli/cli256-node.js network sync
```

### Export Data

```bash
# Export blockchain data ke JSON
./cli/cli256-node.js export

# Export dengan format dan nama file custom
./cli/cli256-node.js export --format json --output my-blockchain-backup
```

## 💰 CLI256 Wallet Commands

### Generate Wallet Baru

```bash
# Generate wallet baru dengan nama default
./cli/cli256-wallet.js generate

# Generate wallet dengan nama custom
./cli/cli256-wallet.js generate --name my-wallet

# Generate dan save ke file
./cli/cli256-wallet.js generate --name my-wallet --output my-wallet.json
```

### Import Wallet

```bash
# Import wallet dari private key
./cli/cli256-wallet.js import --name imported-wallet --key 0x1234567890abcdef...

# Import wallet dari file
./cli/cli256-wallet.js import --file my-wallet.json
```

### Balance & Transactions

```bash
# Cek balance wallet aktif
./cli/cli256-wallet.js balance

# Cek balance address tertentu
./cli/cli256-wallet.js balance --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Send CLI256 tokens
./cli/cli256-wallet.js send --to 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678 --amount 100

# Send dengan interactive mode
./cli/cli256-wallet.js send
```

### Wallet Management

```bash
# List semua wallet
./cli/cli256-wallet.js list

# Generate QR code untuk alamat
./cli/cli256-wallet.js qrcode

# Generate QR code untuk alamat tertentu
./cli/cli256-wallet.js qrcode --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Export wallet ke file
./cli/cli256-wallet.js export --name my-wallet --output exported-wallet.json
```

### Transaction History

```bash
# Tampilkan riwayat transaksi
./cli/cli256-wallet.js history

# Tampilkan 20 transaksi terakhir
./cli/cli256-wallet.js history --limit 20

# Riwayat untuk alamat tertentu
./cli/cli256-wallet.js history --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
```

## 🌐 Web Dashboard Features

### 1. Network Overview
- Real-time block height monitoring
- Total transactions counter
- Active nodes status
- CLI256 token supply tracking

### 2. Theme Selection
Dashboard mendukung 7 tema warna:
- **Dark** (Default)
- **Neon Blue** - Tema biru cyberpunk
- **Matrix Green** - Tema hijau matrix
- **Fire Orange** - Tema orange energik
- **Ice Blue** - Tema biru dingin
- **Pink Cyber** - Tema pink cyber
- **Gold Luxury** - Tema emas mewah

### 3. Interactive Tabs
- **Network Overview** - Status jaringan dan statistik
- **Node Status** - Monitoring node-node aktif
- **Transactions** - Riwayat transaksi
- **Smart Contracts** - Management smart contract

### 4. Pages
- **Wallet** (`/wallet`) - Management wallet dan transaksi
- **Developer Console** (`/developer`) - Console khusus developer dengan access codes
- **Blockchain Manager** (`/blockchain`) - Management blockchain dan authority operations
- **Contracts** (`/contracts`) - Smart contract deployment dan management
- **Transactions** (`/transactions`) - Detailed transaction explorer

## 🔐 Developer Access System

Dashboard memiliki sistem akses khusus untuk developer di `/developer` dengan kode akses berikut:

### Primary Developer
```
Code: CLI256-PRIME-DEV-2024
Access Level: Full administrative access
```

### Senior Developer
```
Code: CLI256-SENIOR-ACCESS-7891
Access Level: Network configuration and debugging
```

### Security Administrator
```
Code: CLI256-SEC-ADMIN-4567
Access Level: Security monitoring and validator management
```

### System Operator
```
Code: CLI256-SYS-OPS-1234
Access Level: Node monitoring and basic operations
```

## 📊 CLI256 Token Distribution

Total Supply: **250,000,000 CLI256**

- **Foundation Reserve**: 50,000,000 CLI256 (20%)
- **Development Fund**: 37,500,000 CLI256 (15%)
- **Validator Rewards**: 75,000,000 CLI256 (30%)
- **Public Distribution**: 62,500,000 CLI256 (25%)
- **Ecosystem Growth**: 25,000,000 CLI256 (10%)

### Foundation Addresses
```
Foundation: 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
Development: 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678
Validator Pool: 0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901
Public: 0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12
Ecosystem: 0x789c90Aa0987E4876169f7gJ82I1A1e4a0H1B23
```

## 🏗️ Architecture Overview

### Consensus Mechanism
- **Proof-of-Authority (PoA)**: Validator-based consensus untuk performa tinggi
- **Block Time**: 5 detik per block
- **Network ID**: cli256-mainnet

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS dengan custom cyberpunk theme
- **CLI Tools**: Node.js dengan Commander.js
- **Blockchain Core**: JavaScript/Node.js implementation
- **Database**: File-based storage (development), siap migrasi ke RocksDB/LevelDB

### Smart Contract Support
- Native CLI256 token contract
- EVM-compatible execution environment (roadmap)
- Contract deployment dan management tools

## 🔒 Security Features

### Wallet Security
- AES-256-CBC encryption untuk private keys
- Password-protected wallet files
- Secure transaction signing
- QR code generation untuk sharing addresses

### Network Security
- Validator-based consensus mencegah 51% attacks
- Encrypted peer-to-peer communication
- Transaction signature verification
- Nonce-based replay attack protection

## 📈 Network Monitoring

### Real-time Metrics
- Block height tracking
- Transaction throughput (TPS)
- Network uptime monitoring
- Validator performance metrics
- Node synchronization status

### Network Health Indicators
- Consensus health: 100%
- Network uptime: 99.97%
- Node synchronization: 98.4%

## 🚀 Getting Started - Complete Workflow

### 1. Initialize Blockchain
```bash
# Inisialisasi blockchain
./cli/cli256-node.js init

# Start node sebagai validator
./cli/cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
```

### 2. Create Wallet
```bash
# Generate wallet baru
./cli/cli256-wallet.js generate --name my-wallet

# Cek balance
./cli/cli256-wallet.js balance
```

### 3. Perform Transaction
```bash
# Send tokens
./cli/cli256-wallet.js send --to 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678 --amount 100

# Cek history
./cli/cli256-wallet.js history
```

### 4. Monitor Network
```bash
# Cek status node
./cli/cli256-node.js status

# Monitor blockchain
./cli/cli256-node.js blockchain --blocks 5

# Network info
./cli/cli256-node.js network info
```

### 5. Access Web Dashboard
1. Start web server: `npm run dev`
2. Buka `http://localhost:3000`
3. Explore semua fitur dashboard
4. Access developer console dengan kode khusus
5. Monitor real-time network metrics

## 🛠️ Development & Customization

### Environment Setup
```bash
# Clone repository
git clone <repository-url>
cd cli256-blockchain

# Install dependencies
npm install
cd cli && npm install

# Start development
npm run dev
```

### Custom Theme Development
Edit file `client/global.css` untuk membuat tema custom:

```css
[data-theme="custom-theme"] {
  --background: YOUR_BACKGROUND_COLOR;
  --foreground: YOUR_TEXT_COLOR;
  --primary: YOUR_PRIMARY_COLOR;
  /* ... other color variables */
}
```

### Adding New CLI Commands
Extend CLI tools di `cli/cli256-node.js` atau `cli/cli256-wallet.js`:

```javascript
program
  .command('your-command')
  .description('Your command description')
  .action(() => {
    // Your command implementation
  });
```

## 📚 Additional Resources

- **Architecture Documentation**: `BLOCKCHAIN_ARCHITECTURE.md`
- **Token Specification**: `contracts/CLI256_TOKEN_SPEC.md`
- **Developer Setup**: `DEVELOPER_SETUP.md`
- **Usage Guide**: `CLI256_USAGE_GUIDE.md`

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**CLI256 Blockchain** - Next-generation Layer 1 blockchain with Proof-of-Authority consensus, built for speed, security, and scalability.
