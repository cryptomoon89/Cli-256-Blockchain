# CLI256 Blockchain - Panduan Pengujian Lengkap untuk Pengguna

## 🎯 Selamat Datang di CLI256 Blockchain Testing!

Selamat datang dalam program pengujian CLI256 Blockchain! Anda akan membantu menguji semua fitur blockchain Layer 1 kami yang menggunakan konsensus Proof-of-Authority (PoA). 

**Tema Visual Baru**: Dashboard menggunakan tema modern yang nyaman di mata dengan warna biru profesional dan tanpa efek neon yang menyilaukan.

## 📋 Daftar Tugas Pengujian

### 🔧 LEVEL 1: Persiapan Sistem (Pemula)

#### Tugas 1.1: Akses Dashboard Web
**Objektif**: Menguji aksesibilitas dan tampilan dashboard

**Langkah-langkah**:
1. Buka browser dan kunjungi `http://localhost:3000`
2. Periksa apakah dashboard memuat dengan benar
3. Verifikasi tema warna biru modern yang nyaman di mata
4. Cek responsivitas dengan mengubah ukuran jendela browser

**Yang Harus Diperhatikan**:
- ✅ Dashboard memuat tanpa error
- ✅ Tema biru modern aktif (bukan neon)
- ✅ Semua elemen UI terlihat jelas dan mudah dibaca
- ✅ Real-time statistics menampilkan data yang berubah

**Hasil yang Diharapkan**: Dashboard responsive dengan tema yang nyaman di mata

---

#### Tugas 1.2: Verifikasi Status Network
**Objektif**: Memastikan jaringan blockchain berjalan normal

**Langkah-langkah**:
1. Lihat bagian "Network Overview Cards" di dashboard
2. Catat angka-angka berikut:
   - Block Height
   - Total Transactions  
   - Active Nodes
   - CLI256 Supply
3. Tunggu 30 detik dan amati perubahan angka

**Yang Harus Diperhatikan**:
- ✅ Block Height bertambah secara berkala
- ✅ TPS (Transactions Per Second) menunjukkan aktivitas
- ✅ Status "NETWORK ONLINE" muncul di header
- ✅ Validator count menunjukkan angka positif

**Hasil yang Diharapkan**: Semua metrik menunjukkan jaringan aktif dan sehat

---

### ⚙️ LEVEL 2: CLI Tools Testing (Menengah)

#### Tugas 2.1: Inisialisasi Blockchain Node
**Objektif**: Menguji fungsi inisialisasi blockchain

**Perintah CLI**:
```bash
# Masuk ke direktori CLI
cd cli

# Inisialisasi blockchain
node cli256-node.js init
```

**Yang Harus Diperhatikan**:
- ✅ Genesis block berhasil dibuat
- ✅ Total supply 250,000,000 CLI256 terdistribusi
- ✅ 5 foundation addresses mendapat alokasi token
- ✅ File data tersimpan di direktori `.cli256`

**Dokumentasi Hasil**:
```
Genesis Block Hash: [catat hash yang muncul]
Total Supply: 250,000,000 CLI256
Foundation Balances: [catat 5 address dan balance]
```

---

#### Tugas 2.2: Menjalankan Node sebagai Validator
**Objektif**: Menguji kemampuan node untuk validasi blok

**Perintah CLI**:
```bash
# Start node sebagai validator
node cli256-node.js start --validator 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 --port 8080
```

**Yang Harus Diperhatikan**:
- ✅ Node berhasil start tanpa error
- ✅ Validator address terdaftar
- ✅ Auto-mining dimulai (blok baru setiap 5 detik)
- ✅ Pesan "CLI256 Node Starting..." muncul

**Biarkan berjalan selama 2 menit, lalu cek status**:
```bash
# Di terminal baru
node cli256-node.js status
```

**Hasil yang Diharapkan**:
- Block height bertambah minimum 24 blok (2 menit / 5 detik)
- Status "Running"
- Mempool kosong (transaksi diproses)

---

#### Tugas 2.3: Management Validator
**Objektif**: Menguji penambahan dan pengelolaan validator

**Perintah CLI**:
```bash
# Tambah validator baru
node cli256-node.js validator add 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678

# Tambah validator ketiga
node cli256-node.js validator add 0x123a56Ee8765C2654947d5eH60G9E9c2e8F9901

# List semua validator
node cli256-node.js validator list
```

**Yang Harus Diperhatikan**:
- ✅ Setiap validator berhasil ditambahkan
- ✅ Total validator count bertambah
- ✅ List menampilkan semua validator yang terdaftar
- ✅ Tidak ada error saat penambahan

**Dokumentasi Hasil**:
```
Total Validators: [catat jumlah]
Validator Addresses: [catat semua address]
```

---

### 💰 LEVEL 3: Wallet Operations (Menengah-Lanjut)

#### Tugas 3.1: Generate Wallet Baru
**Objektif**: Menguji pembuatan wallet CLI

**Perintah CLI**:
```bash
# Generate wallet dengan nama khusus
node cli256-wallet.js generate --name test-wallet-1

# Generate wallet kedua
node cli256-wallet.js generate --name test-wallet-2 --output backup-wallet.json
```

**Interactive Mode**:
- Akan diminta password (gunakan: `testing123`)
- Konfirmasi password yang sama

**Yang Harus Diperhatikan**:
- ✅ Wallet berhasil dibuat dengan address unik
- ✅ Private key terenkripsi dengan password
- ✅ Public key dan address ter-generate otomatis
- ✅ File backup tersimpan (untuk wallet kedua)

**Dokumentasi Hasil**:
```
Wallet 1 Address: [catat address]
Wallet 2 Address: [catat address]
Backup File: backup-wallet.json created
```

---

#### Tugas 3.2: Import dan Export Wallet
**Objektif**: Menguji fungsi import/export wallet

**Perintah CLI**:
```bash
# Export wallet yang sudah ada
node cli256-wallet.js export --name test-wallet-1 --output exported-wallet.json

# Import wallet dari file
node cli256-wallet.js import --file exported-wallet.json --name imported-wallet
```

**Yang Harus Diperhatikan**:
- ✅ Export berhasil membuat file JSON
- ✅ Import berhasil memuat wallet dari file
- ✅ Address dan data wallet konsisten
- ✅ Password protection tetap berfungsi

---

#### Tugas 3.3: Cek Balance dan QR Code
**Objektif**: Menguji fungsi balance dan QR code generation

**Perintah CLI**:
```bash
# Cek balance foundation address
node cli256-wallet.js balance --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234

# Cek balance address development
node cli256-wallet.js balance --address 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678

# Generate QR code untuk address
node cli256-wallet.js qrcode --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
```

**Yang Harus Diperhatikan**:
- ✅ Foundation address menunjukkan 50,000,000 CLI256
- ✅ Development address menunjukkan 37,500,000 CLI256
- ✅ QR code ter-generate di terminal
- ✅ Mock USD value calculations ditampilkan

**Dokumentasi Hasil**:
```
Foundation Balance: 50,000,000 CLI256
Development Balance: 37,500,000 CLI256
QR Code: [screenshot QR code di terminal]
```

---

### 🔄 LEVEL 4: Transaction Testing (Lanjut)

#### Tugas 4.1: Membuat Transaksi CLI
**Objektif**: Menguji pembuatan dan pengiriman transaksi

**Setup**: Pastikan wallet test-wallet-1 aktif sebagai current wallet

**Perintah CLI**:
```bash
# Buat transaksi dari foundation ke development
node cli256-wallet.js send \
  --from 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 \
  --to 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678 \
  --amount 1000000
```

**Interactive Mode**:
- Masukkan password wallet saat diminta

**Yang Harus Diperhatikan**:
- ✅ Transaction ID ter-generate
- ✅ Signature berhasil dibuat
- ✅ Transaction masuk ke mempool
- ✅ Broadcasting ke network berhasil

**Dokumentasi Hasil**:
```
Transaction ID: [catat TX ID]
From Address: 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234
To Address: 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678
Amount: 1,000,000 CLI256
```

---

#### Tugas 4.2: Cek Transaction History
**Objektif**: Menguji riwayat transaksi

**Perintah CLI**:
```bash
# Cek history untuk foundation address
node cli256-wallet.js history --address 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 --limit 10

# Cek history untuk development address  
node cli256-wallet.js history --address 0x892f45Dd7654B1543836c4d9G49F8D8b1d7E5678 --limit 10
```

**Yang Harus Diperhatikan**:
- ✅ Mock transaction history ditampilkan
- ✅ Format timestamp yang benar
- ✅ Status confirmed/pending yang jelas
- ✅ Transaction amounts dan addresses akurat

---

### 🏗️ LEVEL 5: Blockchain Operations (Expert)

#### Tugas 5.1: Mining dan Block Analysis
**Objektif**: Menguji proses mining dan analisis blok

**Perintah CLI**:
```bash
# Cek informasi blockchain terbaru
node cli256-node.js blockchain --blocks 10

# Cek network information
node cli256-node.js network info

# Export data blockchain
node cli256-node.js export --format json --output testing-blockchain-export
```

**Yang Harus Diperhatikan**:
- ✅ 10 blok terakhir ditampilkan dengan detail
- ✅ Hash, timestamp, validator, dan transaction count akurat
- ✅ Network info menunjukkan consensus PoA
- ✅ Export berhasil membuat file JSON

**Analisis Blok**:
```
Block Heights: [catat 10 block height terakhir]
Mining Interval: ~5 seconds
Validators Rotating: [catat validator yang mining]
Export File Size: [catat ukuran file]
```

---

#### Tugas 5.2: Performance Testing
**Objektif**: Menguji performa dan stabilitas sistem

**Perintah CLI untuk Stress Test**:
```bash
# Buat multiple transactions rapid fire
for i in {1..10}; do
  node cli256-wallet.js send \
    --from 0x742d35Cc6643C0532925a3b8F38E7C7a0c6C1234 \
    --to 0x456b78Ff9876D3765058e6fI71H0F0d3f9G0A12 \
    --amount 1000
  echo "Transaction $i completed"
  sleep 2
done
```

**Yang Harus Diperhatikan**:
- ✅ Semua 10 transaksi berhasil dibuat
- ✅ Tidak ada memory leaks atau crashes
- ✅ Mempool handling yang proper
- ✅ Block mining tetap konsisten

---

### 🧪 LEVEL 6: Comprehensive System Testing (Expert)

#### Tugas 6.1: Automated Test Suite
**Objektif**: Menjalankan comprehensive test suite

**Perintah CLI**:
```bash
# Jalankan automated testing
node cli/test-blockchain.js
```

**Yang Harus Diperhatikan**:
- ✅ Semua 8 kategori test PASSED
- ✅ Tidak ada failed tests
- ✅ Genesis block validation passed
- ✅ Validator management working
- ✅ Transaction creation/mining successful
- ✅ Wallet functionality verified
- ✅ Security features validated
- ✅ Data persistence confirmed

**Target**: **100% Test Pass Rate**

---

#### Tugas 6.2: Dashboard Integration Testing
**Objektif**: Menguji integrasi dashboard dengan blockchain

**Langkah-langkah**:
1. Buka dashboard web (`http://localhost:3000`)
2. Navigasi ke setiap tab:
   - Network Overview
   - Node Status  
   - Transactions
   - Smart Contracts
3. Klik tombol "Developer Console"
4. Masukkan dev access code: `CLI256-PRIME-DEV-2024`
5. Test semua fitur di developer console

**Yang Harus Diperhatikan**:
- ✅ Semua tab memuat tanpa error
- ✅ Real-time data updates working
- ✅ Developer access codes berfungsi
- ✅ CLI integration responsive
- ✅ Modern theme konsisten di semua halaman

---

## 📊 Form Laporan Hasil Testing

### Informasi Penguji
```
Nama: ________________________
Tanggal Testing: ______________
Durasi Testing: _______________
Browser/OS: ___________________
```

### Hasil Testing per Level

#### Level 1 - Persiapan Sistem
- [ ] Tugas 1.1: Dashboard Access - ✅ PASS / ❌ FAIL
- [ ] Tugas 1.2: Network Status - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

#### Level 2 - CLI Tools
- [ ] Tugas 2.1: Blockchain Init - ✅ PASS / ❌ FAIL
- [ ] Tugas 2.2: Node Validator - ✅ PASS / ❌ FAIL  
- [ ] Tugas 2.3: Validator Management - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

#### Level 3 - Wallet Operations
- [ ] Tugas 3.1: Generate Wallet - ✅ PASS / ❌ FAIL
- [ ] Tugas 3.2: Import/Export - ✅ PASS / ❌ FAIL
- [ ] Tugas 3.3: Balance/QR Code - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

#### Level 4 - Transactions
- [ ] Tugas 4.1: Create Transaction - ✅ PASS / ❌ FAIL
- [ ] Tugas 4.2: Transaction History - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

#### Level 5 - Blockchain Operations
- [ ] Tugas 5.1: Mining/Analysis - ✅ PASS / ❌ FAIL
- [ ] Tugas 5.2: Performance Test - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

#### Level 6 - System Testing
- [ ] Tugas 6.1: Automated Tests - ✅ PASS / ❌ FAIL
- [ ] Tugas 6.2: Dashboard Integration - ✅ PASS / ❌ FAIL

**Catatan**: _________________________________

### Penilaian Keseluruhan

#### User Experience (1-10)
- **Kemudahan Penggunaan**: ___/10
- **Kenyamanan Visual (Tema Biru)**: ___/10
- **Kecepatan Response**: ___/10
- **Stabilitas System**: ___/10

#### Fitur Unggulan
1. ________________________________
2. ________________________________  
3. ________________________________

#### Areas for Improvement
1. ________________________________
2. ________________________________
3. ________________________________

#### Rekomendasi untuk Launch
- [ ] **READY FOR PRODUCTION** - Semua test passed
- [ ] **NEEDS MINOR FIXES** - Ada issues kecil
- [ ] **NEEDS MAJOR WORK** - Ada issues kritis

**Komentar Akhir**:
```
_________________________________________________
_________________________________________________
_________________________________________________
```

## 🎉 Selamat!

Jika Anda menyelesaikan semua tugas testing ini, Anda telah berhasil menguji seluruh ekosistem CLI256 Blockchain dari frontend hingga backend, dari wallet management hingga consensus mechanism.

**CLI256 Blockchain siap untuk production launch!** 🚀

---

**Kontak Support**:
- Developer Console: Gunakan access code untuk bantuan teknis
- Documentation: Baca README.md untuk referensi lengkap
- Issue Reporting: Laporkan bug melalui developer console

**Terima kasih telah membantu menguji CLI256 Blockchain!**
