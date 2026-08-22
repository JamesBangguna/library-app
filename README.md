# 🚀Library-App

## 🚀 Library-App

Selamat datang di Project Library App yang bisa login, lihat daftar buku, pinjam, review, dan cek riwayat. Bisa Masuk Role User dan Role Admin.

---

## 1. Tech Stack :

• React + TypeScript: framework + type safety
• Tailwind CSS: styling cepat
• shadcn/ui: komponen siap pakai
• Redux Toolkit: simpan token, filter, cart, UI state
• TanStack Query: fetching + caching data
• Optimistic UI: UX cepat (stok langsung berkurang saat pinjam)
• (Opsional) Framer Motion: animasi transisi

---

## 2. Halaman

| Halaman        | Fitur Utama                                 |
| -------------- | ------------------------------------------- |
| Login/Register | Form login & register: simpan token         |
| Book List      | List buku + filter kategori+ search         |
| Book Detail    | Detail buku + stok + review + tombol pinjam |
| My Loans       | Daftar pinjaman user                        |
| My Profile     | Data user + statistik                       |
| (Opsional)Cart | Pinjam banyak buku sekaligus                |

---

## 3. Manajemen State

• Redux Toolkit
o authSlice: token + data user
o uiSlice: filter & search
o (Opsional) cartSlice: daftar buku yang mau dipinjam
• React Query
o useQuery: fetch books, detail, loans
o useMutation: login, pinjam, review
o Aktifkan optimistic update supaya UI cepat
UX / UI Guideline
• Pakai shadcn/ui untuk konsistensi
• Tailwind untuk layout responsive
• Tambahkan loading + error state di semua halaman
• Pakai toast/snackbar untuk feedback sukses/gagal
• Format tanggal dengan baik dan best practice
Flow Utama

1. Login/Register → simpan token
2. Browse Books → filter/search → klik detail
3. Pinjam Buku → stok berkurang (optimistic)
4. Tambah Review → langsung muncul
5. My Loans → cek status & due date
6. My Profile → update profil, lihat statistic
7. Admin All Feature
   Definition of Done
   • Login & register berjalan
   • List buku tampil + bisa filter/search
   • Detail buku & review tampil
   • Pinjam buku bisa → stok berkurang
   • Daftar pinjaman user tampil
   • Review bisa ditambah/hapus
   • Semua request yang butuh token → dicek
   • UI rapi, responsive, ada loading/error state

---

## 4. Struktur Folder

```
src/
├── api/                  # Axios instance & interceptors
├── assets/
├── components/           # Reusable UI components
│   ├── ui/               # shadcn components
│   ├── common/           # Button, Loading, EmptyState, dll
│   └── layout/           # Navbar, Sidebar, Footer, Breadcrumb
├── features/             # Feature-based modules
│   ├── auth/
│   ├── books/
│   ├── loans/
│   ├── reviews/
│   ├── profile/
│   └── admin/
├── hooks/                # Custom hooks
├── layouts/              # MainLayout, AdminLayout, AuthLayout
├── lib/                  # Utils (cn, formatDate, dll)
├── pages/                # Page components
│   ├── auth/
│   ├── user/
│   └── admin/
├── routes/               # Route definitions & ProtectedRoute
├── services/             # API service functions
├── store/                # Redux store
│   ├── slices/
│   └── index.ts
├── types/                # TypeScript interfaces
└── utils/

```

---

## 5. Setup Awal

Perintah dasar:

```bash
npm run dev      # menjalankan dev server
npm run build    # build production

```

---
