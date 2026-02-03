# Sistem Informasi Manajemen Keanggotaan & Wilayah Terintegrasi

Aplikasi ini adalah solusi digitalisasi manajemen keanggotaan organisasi yang dirancang untuk menggantikan sistem manual. Sistem ini mencakup alur lengkap mulai dari **Pendaftaran Anggota Baru (Public)** hingga **Dashboard Monitoring & Rekapitulasi (Admin)** dengan konsep akses data berjenjang (*Hierarchical Role-Based Access Control*).

Aplikasi ini memetakan struktur wilayah Indonesia (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan) dan memberikan hak akses data sesuai dengan wilayah kerja administrator.

## 🛠 Tech Stack

### Frontend
* **React.js + Vite** (UI Library & Build Tool)
* **Tailwind CSS** (Styling)
* **Axios** (HTTP Client)
* **Chart.js** (Visualisasi Grafik)

### Backend
* **Node.js + Express (TypeScript)** (Server Framework)
* **Prisma ORM** (Database Management)
* **MySQL / PostgreSQL** (Database)
* **XLSX** (Excel Export Engine)
* **JWT & Bcrypt** (Authentication & Security)

## ✨ Fitur Utama

### 1. Pendaftaran Anggota (Public Access)
Formulir pendaftaran digital dengan validasi ketat:
* **Validasi NIK/KTP:** Harus numeric, 16 digit, dan *unique*.
* **Wilayah Dependent:** Pilihan wilayah bertingkat (Provinsi -> Kabupaten -> Kecamatan -> Kelurahan) yang saling terikat.
* **Validasi Data:** Memastikan integritas data sebelum masuk ke database.

### 2. Dashboard Monitoring (Real-time)
Menampilkan statistik vital organisasi:
* Grafik pertumbuhan anggota per 5 menit (dalam 30 menit terakhir).
* Counter total pendaftaran hari ini.
* Total akumulasi seluruh anggota.

### 3. Hierarki Akses Data (Role-Based Access)
Sistem membatasi visibilitas data berdasarkan tingkatan admin yang login:
* **Admin Pusat:** Melihat seluruh data Nasional.
* **Admin Provinsi:** Hanya melihat data di provinsinya.
* **Admin Kabupaten:** Hanya melihat data di kabupatennya.
* **Admin Kecamatan:** Hanya melihat data di kecamatannya.
* **Admin Kelurahan:** Hanya melihat daftar anggota di kelurahannya.

### 4. Rekapitulasi & Export Data
* Tabel rekapitulasi jumlah anggota per wilayah (*Drill-down*).
* Fitur **Export to Excel** yang cerdas (Menyesuaikan data yang diexport dengan hak akses wilayah admin).
* Pagination data (5 baris per halaman).

### 5. Manajemen Pengguna (Superadmin Only)
Fitur khusus Admin Pusat untuk:
* Membuat akun admin daerah (Provinsi s/d Kelurahan).
* Mengatur wilayah kerja admin (*Assignment Region*).
* Edit & Hapus akses pengguna.

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Anda telah menginstal **Node.js** dan memiliki database **PostgreSQL/MySQL** yang aktif.

### 1. Konfigurasi Backend
Masuk ke folder backend, install dependency, setup database, dan jalankan server.

```bash
cd backend

# 1. Install Dependencies
npm install

# 2. Setup Environment Variable
# (Pastikan file .env sudah berisi DATABASE_URL yang benar)

# 3. Sinkronisasi Database & Generate Client
npx prisma db push
npx prisma generate

# 4. Seeding Data (PENTING: Untuk membuat User & Wilayah awal)
npx prisma db seed

# 5. Jalankan Server
npm run dev
```
Backend akan berjalan di http://localhost:3000

2. Konfigurasi Frontend
Buka terminal baru, masuk ke folder frontend, dan jalankan aplikasi.

Bash
```
cd frontend

# 1. Install Dependencies
npm install

# 2. Jalankan Aplikasi
npm run dev
```
Frontend akan berjalan di http://localhost:5173
