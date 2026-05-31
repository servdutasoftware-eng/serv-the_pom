_PRODUCT REQUIREMENTS DOCUMENT (PRD)_

Nama Produk: SERV the Pom (Aplikasi Kasir & Anti-Fraud Pom Mini)
Platform: Android (APK) untuk Produksi & Web untuk Demo
Fase: MVP (Minimum Viable Product) - V1.01.

1. Ringkasan Eksekutif
   Aplikasi ini dirancang khusus untuk pemilik UMKM Pom Mini guna menyelesaikan masalah utama: kecurangan kasir yang tidak menyetorkan uang hasil penjualan secara penuh. Mengingat mesin Pom Mini tidak memiliki indikator stok digital, "SERV the Pom" menggunakan pendekatan rekayasa sistem berupa Batch-Based Auditing dan Blind Stock. Aplikasi ini mengusung arsitektur Offline-First menggunakan satu perangkat (HP) yang sama untuk kasir dan owner, menjamin operasional yang tangguh di daerah minim sinyal.

2. Objektif Produk
   Meniadakan Kecurangan: Menutup celah manipulasi data oleh kasir melalui sistem Blind Stock dan pencatatan anomali otomatis.Zero Friction UI: Memastikan kasir bisa mencatat transaksi baru dalam waktu kurang dari 2 detik.Audit Cerdas: Membebaskan owner dari cek stok manual harian, diganti dengan audit pada akhir siklus (saat fisik tangki habis).100% Offline Capable: Memastikan operasional kasir tidak terganggu oleh ketiadaan internet, dengan sinkronisasi ke cloud yang dikontrol penuh oleh owner.

3. Target Pengguna (User Personas)
   A. SistemKasir (Karyawan)
   Operator harian di lapangan. Membutuhkan antarmuka yang sangat cepat, anti-ribet, dan tidak bergantung pada sinyal internet.Layar Transaksi (Hanya nominal cepat, misal: 10k, 15k, 20k).
   B. Owner (Pemilik)Pemilik modal.
   Membutuhkan laporan yang presisi, sistem audit saat bensin habis, dan kontrol keamanan penuh atas aplikasi.Dasbor Admin, Rekonsiliasi Batch, Cloud Backup.

4. Spesifikasi Fitur Utama
   A. Modul Transaksi Kasir (Zero Friction UI)
   Mode Hybrid (Nominal & Liter):
   Kasir bisa menginput berdasarkan uang pembeli (Rp) atau permintaan volume (Liter).

- Tombol Nominal Cepat:
  Layar utama didesain dengan tombol raksasa (quick input) berdasarkan nominal yang paling sering dibeli (10k, 15k, 20k, 50k).
- Kalkulator Konversi Otomatis:
  Jika kasir menginput Rp, sistem langsung menampilkan estimasi Liter (berdasarkan harga terkini), begitu pula sebaliknya.
- Struk Opsional (Toggle):
  Layar struk dilewati secara default agar kasir bisa langsung melayani antrean berikutnya. Tersedia toggle cetak di layar.
- Blind Stock:
  Kasir tidak diberikan akses visual untuk melihat sisa stok bensin digital.

B. Modul Audit & Rekonsiliasi Owner (Batch System)

- PIN Gate Security & Multi-Kasir:
  Akses masuk ke dasbor owner dilindungi PIN 6 digit. Login kasir juga dipisah dengan PIN unik untuk identifikasi sesi (shift) secara presisi.
- Manajemen Batch & Sisa Bensin:
  Owner menginput volume bensin awal. Dasbor dilengkapi indikator bar (progress) Sisa Bensin Digital secara live.
- Kalkulator Selisih, Toleransi & Fraud:
  Saat bensin fisik habis, owner menekan Tutup Batch. Sistem otomatis menghitung penyusutan. Jika > 1%, muncul alarm peringatan FRAUD/KEBOCORAN.
- Pengaturan Harga Dinamis:
  Owner dapat mengubah harga per liter bensin secara real-time dan langsung mempengaruhi kalkulator kasir.
- Siklus Shift & Laporan:
  Fitur Tarik Uang & Reset untuk akumulasi uang laci per kasir, dan log 10 transaksi terakhir yang berjalan live.

C. Modul Sinkronisasi Cloud & Backup

- Offline-First Engine:
  Semua data transaksi disimpan secara instan di database lokal perangkat.
- Kendali Backup:
  Owner dapat menyalakan mode Otomatis (sinkronisasi latar belakang saat ada internet) atau Manual (menekan tombol unggah).
- Indikator Unsynced Data: Peringatan visual yang menampilkan jumlah transaksi yang belum diamankan ke cloud.

5. Arsitektur & Teknologi (Tech Stack)
   A. Frontend Web (MVP Demo Version - SELESAI)
   React.js + Vite: Dibangun secara ultra-ringan sebagai SPA (Single Page Application) yang sangat responsif, meniru ukuran layar mobile.
   B. Local Database (MVP Demo Version - SELESAI)
   Browser LocalStorage: Semua data (transaksi, shift, batch) diamankan di memori browser pengguna. Membuktikan kemampuan 100% Offline-First.
   C. Skala Produksi (Fase 2 / Tahap APK)
   Sistem akan di-porting ke Flutter (Frontend), Isar Database (Local DB Terenkripsi), dan Supabase (Cloud Backend) untuk rilis final di perangkat kasir fisik.

6. Persyaratan Keamanan (Security Layers)
   A. Kiosk Mode / App Pinning:
   Memanfaatkan fitur OS Android agar kasir tidak bisa keluar dari aplikasi atau melakukan Clear Data.
   B. Database Encryption:
   Enkripsi AES-256 pada Isar Database lokal untuk mencegah pencurian atau manipulasi data melalui rooting atau USB Debugging.
   C. Anti-Tamper Time:
   Menggunakan Sequential Hash. Jika waktu sistem diubah mundur oleh kasir, sistem memberikan label anomali dan mencatatnya di log keamanan.
   D. Anti-Brute Force PIN:
   Mengunci dasbor selama 5 menit jika PIN owner salah 3 kali, dan 1 jam jika salah 5 kali.

7. Struktur Database Lokal Inti
   A. Tabel Refill_Batches:

- id (String/UUID - Primary Key)
- opened_at (DateTime)
- closed_at (DateTime, Nullable)
- initial_volume_liter (Double)
- final_digital_liter (Double, Nullable)
- status (String: ACTIVE/CLOSED)
- is_synced(Boolean)

B Tabel Transactions:

- id (String/UUID - Primary Key)
- batch_id (String/UUID - Foreign Key)
- amount_rupiah (Integer)
- volume_liter (Double)
- created_at (DateTime)
- is_corrected (Boolean)
- is_synced (Boolean)

C. Tabel Security_Logs:

- id (String/UUID - Primary Key)
- event_type (String)
- description (String)
- created_at (DateTime)
- is_synced (Boolean)

8. Di Luar Cakupan (Out of Scope - Fase 2)

- Integrasi sensor perangkat keras (IoT) untuk mengukur debit bensin secara otomatis.
- Metode pembayaran digital interaktif (QRIS Dinamis, E-Wallet, Transfer Bank).
- Manajemen Multi-Cabang (sinkronisasi data antar beberapa perangkat Pom Mini di lokasi berbeda).

9. Asumsi & Batasan Sistem (Constraints)

- Minimum Sistem Operasi:
  Perangkat harus menjalankan minimal Android 8.0 (Oreo) untuk kompatibilitas Isar Database dan dukungan enkripsi.
- Orientasi Layar:
  Antarmuka dikunci secara ketat pada mode Portrait dan dioptimalkan untuk dimensi smartphone (4.5 - 6.5 inci).
- Konektivitas Berkala:
  Owner diasumsikan memiliki akses internet (tethering atau WiFi) secara berkala (minimal saat rekonsiliasi batch) untuk memicu backup data ke cloud.

10. Kriteria Kesuksesan (Success Metrics)

- Kecepatan Transaksi:
  Waktu yang dibutuhkan kasir untuk mencatat transaksi baru sejak aplikasi terbuka adalah < 2 detik.
- Keakuratan Stok:
  Tingkat kebocoran yang tidak terdeteksi mencapai 0% (setelah dikalkulasi dengan batas toleransi penguapan).
- Integritas Data:
  Rasio kesuksesan sinkronisasi data dari lokal ke cloud mencapai 100% tanpa ada data ganda (duplicate) atau yang hilang (lost/drop).
