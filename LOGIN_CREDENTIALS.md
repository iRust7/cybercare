# CyberCare UMKM - Login Credentials

## 🔐 Akun Demo untuk Testing

Berikut adalah kredensial login yang tersedia untuk mengakses sistem CyberCare:

### 1. Akun User Regular
- **Email**: `budi@example.com`
- **Password**: `password123`
- **Role**: User
- **Business**: Toko Budi Elektronik
- **Deskripsi**: Akun user biasa untuk mengakses materi pembelajaran, kuis, dan fitur umum

### 2. Akun Administrator
- **Email**: `admin@cybercare.com`
- **Password**: `admin123`
- **Role**: Admin
- **Business**: CyberCare Platform
- **Deskripsi**: Akun administrator dengan akses penuh ke sistem

---

## 📋 Informasi Keamanan

### Password Hashing
Password di database telah di-hash menggunakan **SHA-256**:
- `password123` → `ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f`
- `admin123` → `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

### Fitur Keamanan yang Telah Diimplementasikan
1. ✅ **Token-based Authentication** - Menggunakan token untuk validasi session
2. ✅ **Session Management** - Session timeout 30 menit
3. ✅ **Secure Headers** - Authorization header dengan Bearer token
4. ✅ **Session Timeout** - Otomatis logout setelah 30 menit inaktif
5. ✅ **Activity Tracking** - Reset session pada aktivitas user
6. ✅ **Password Validation** - Validasi kekuatan password (minimal 8 karakter, huruf + angka)
7. ✅ **Email Validation** - Validasi format email
8. ✅ **Security Logging** - Log untuk login, logout, dan kegagalan autentikasi

---

## 🚀 Cara Login

1. Buka halaman login: `frontend/login.html`
2. Masukkan email dan password dari salah satu akun di atas
3. Klik tombol "Masuk"
4. Anda akan diarahkan ke dashboard

---

## 🔧 Setup Database

Jika database belum di-setup, jalankan script berikut:

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan setup script
source backend/SETUP_DATABASE.sql
```

Atau melalui phpMyAdmin:
1. Buka phpMyAdmin
2. Buat database baru atau pilih database existing
3. Import file `backend/SETUP_DATABASE.sql`

---

## 🛡️ Rekomendasi Keamanan untuk Production

1. **Ganti Password Default** - Ubah semua password demo sebelum production
2. **Gunakan Environment Variables** - Simpan credentials di file `.env`
3. **HTTPS Only** - Gunakan HTTPS untuk semua komunikasi
4. **Rate Limiting** - Implementasi rate limiting untuk login attempts
5. **2FA** - Pertimbangkan Two-Factor Authentication
6. **Password Policy** - Enforce password yang lebih kuat
7. **Audit Logs** - Simpan log keamanan untuk audit trail

---

## 📞 Support

Jika mengalami masalah login:
1. Pastikan backend server berjalan di `http://localhost:8080`
2. Cek console browser untuk error messages
3. Verifikasi database sudah di-setup dengan benar
4. Pastikan credentials yang digunakan sesuai dengan yang tertulis di atas

---

**Note**: Credentials ini hanya untuk development dan testing. Jangan gunakan di production!
