# Smart Learning — Frontend

Platform Learning Management System (LMS) berbasis web dengan sistem multi-role, dibangun menggunakan React.js dan Vite.

**Live Demo:** [https://lms-frontend-ten-sigma.vercel.app/](https://lms-frontend-ten-sigma.vercel.app/)

---

## Tentang Project

Smart Learning adalah aplikasi LMS full-stack dengan arsitektur decoupled (frontend dan backend terpisah). Repository ini merupakan bagian frontend yang dikembangkan menggunakan React.js, terhubung ke backend Laravel melalui RESTful API.

Platform mendukung tiga jenis pengguna dengan hak akses berbeda: publik, siswa, dan instruktur.

> Dikerjakan: Maret 2026

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React.js + Vite |
| Styling | Tailwind CSS, SCSS |
| Routing | React Router DOM |
| API | RESTful API (Laravel Backend) |
| Deployment | Vercel |

---

## Fitur Utama

- Sistem multi-role — tampilan dan akses berbeda untuk publik, siswa, dan instruktur
- CRUD materi pembelajaran — tambah, edit, hapus, dan lihat konten kursus
- Video pembelajaran — streaming video materi kursus
- Integrasi API — koneksi penuh ke backend Laravel
- Responsive UI — tampilan optimal di desktop maupun mobile

---

## Struktur Role

| Role | Akses |
|---|---|
| Publik | Melihat daftar kursus yang tersedia |
| Siswa | Mendaftar dan mengakses materi serta video pembelajaran |
| Instruktur | Membuat, mengedit, dan menghapus kursus dan materi |

---

## Cara Menjalankan Secara Lokal

### Prerequisites

Pastikan sudah terinstall:
- Node.js >= 18
- npm atau yarn

### 1. Clone Repository

```bash
git clone https://github.com/sitialfinahursalsabila/lms-frontend.git
cd lms-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root folder:

```env
VITE_API_URL=https://lms-backend-phi-gold.vercel.app
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Buka browser dan akses: `http://localhost:5173`

---

## Tantangan Teknis yang Diselesaikan

- **CORS API** — Konfigurasi komunikasi antara frontend Vercel dan backend Laravel
- **Deployment** — Mengelola environment variables dan proses deployment via Vercel
- **Multi-role routing** — Manajemen akses halaman berdasarkan role pengguna

---

## Screenshots

*(Segera ditambahkan)*

---

## Repository Terkait

Backend repository (Laravel): private

---

## Developer

**Siti Alfinahur Salsabila**
S1 Teknik Informatika — UIN Maulana Malik Ibrahim Malang

Email: sitialfinahursalsabila@gmail.com
Instagram: [@sa_elra](https://instagram.com/sa_elra)

---

## License

MIT License — Project ini dibuat untuk keperluan pembelajaran dan portofolio pribadi.
