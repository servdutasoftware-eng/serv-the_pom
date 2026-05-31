# ⛽ SERV the Pom - Dokumentasi Web Demo

Aplikasi ini adalah prototipe (Web Demo) dari sistem Kasir dan Anti-Fraud untuk UMKM Pom Mini, yang mengusung arsitektur **Offline-First**.

## 🌟 Fitur Utama (MVP V1.01)

### 1. Kinerja Kasir Tanpa Friksi (Zero Friction UI)
*   **Mode Hybrid (Rp & Liter):** Kasir bisa mengetik berdasarkan nominal uang atau takaran liter.
*   **Konversi Otomatis:** Input Rupiah langsung diterjemahkan menjadi estimasi Liter berdasarkan harga dinamis, dan sebaliknya.
*   **Akses Cepat:** Tombol nominal raksasa (10k, 15k, 20k, 50k) meminimalisir waktu ketik.
*   **Sesi Shift Otomatis:** Login menggunakan PIN (Kasir 1 & Kasir 2). Sistem mendeteksi otomatis saat kasir berganti, langsung menutup *shift* lama dan menyimpan laporannya secara rapi.

### 2. Modul Audit Anti-Fraud (Dasbor Owner)
*   **Algoritma Blind Stock:** Kasir sama sekali tidak bisa melihat sisa digital bensin di layar mereka, memotong niat memanipulasi takaran fisik.
*   **Indikator Sisa Digital Live:** Owner bisa memantau sisa bensin virtual melalui *progress bar* yang bereaksi instan setiap ada transaksi.
*   **Kalkulator Rekonsiliasi & Fraud:** Saat fisik tangki habis, tombol "Tutup Batch" akan menghitung selisih penyusutan secara otomatis. Jika selisih melebihi batas toleransi penguapan alami (1%), sistem melontarkan alarm *Indikasi Fraud / Kebocoran*.
*   **Laporan Terpadu:** Memuat laporan total uang di laci (per shift), serta riwayat log 10 transaksi terakhir.
*   **Pengaturan Dinamis:** Owner bebas mengubah harga per liter kapan pun, dan kalkulasi di seluruh aplikasi langsung mengikuti harga baru.

### 3. Ketahanan Sistem (Arsitektur Offline-First)
Seluruh data (Transaksi, Shift, Batch Tangki, Pengaturan Harga) dilindungi penuh oleh sistem *Browser LocalStorage*. 
Ini membuktikan tiga hal:
1. Tidak butuh koneksi internet untuk beroperasi di daerah terpencil.
2. Data kebal dari insiden *refresh* atau aplikasi tidak sengaja tertutup.
3. Aplikasi bertindak sebagai *database*-nya sendiri secara terisolasi.

---

## 🔑 Panduan Simulasi (Demo Guide)

Jika Anda men-*deploy* atau menjalankan *source code* ini, ikuti langkah berikut untuk menguji *workflow* utamanya:

### Skenario 1: Transaksi Kasir
1. Buka aplikasi, Anda akan berada di layar Login.
2. Masukkan PIN Kasir: **`111111`** (Andi) atau **`222222`** (Budi).
3. Di layar Kasir, coba tekan tombol Rp 20k atau ketik manual (misal Rp 24.000). Klik **Proses Transaksi**.
4. Tekan ikon Gembok Merah di sudut kanan atas untuk mengunci layar.

### Skenario 2: Audit Owner & Tutup Batch
1. Di layar Login, klik **Ikon Perisai (Shield)** kecil di pojok kanan bawah layar.
2. Masukkan PIN Owner: **`123456`**.
3. Di Dasbor Owner, Anda akan melihat indikator bar bensin sudah berkurang.
4. Klik **Tutup Batch (Tangki Habis)**. Perhatikan bagaimana *Kalkulator Rekonsiliasi* menganalisis penyusutan bensin Anda (Apakah Wajar atau Fraud?).
5. Coba isi kolom "Volume", masukkan `100`, lalu klik **Buka Batch** untuk memulai stok baru.

### Skenario 3: Ubah Harga & Tarik Uang
1. Masih di Dasbor Owner, gulir ke bawah ke "Pengaturan Sistem".
2. Ubah harga menjadi `12000`, klik Simpan, dan Konfirmasi.
3. Kembali ke layar Login, masuk sebagai Kasir. Perhatikan bahwa konversi Rupiah ke Liter sekarang memakai hitungan Rp12.000/Liter.
4. Kembali ke Dasbor Owner, klik **Tarik Uang & Reset Harian** untuk mengosongkan seluruh uang dari laci dan memulai hari baru dari nol.

---

## 🛠️ Stack Teknologi (Demo Phase)
*   **Framework:** React.js + Vite (Memastikan rendering super cepat).
*   **UI/Styling:** Vanilla CSS (Glassmorphism + Dark Mode khusus).
*   **Icons:** Lucide React.
*   **State Management:** React Context API (`AppContext`).
*   **Persistence:** `window.localStorage`.
