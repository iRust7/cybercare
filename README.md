# 🛡️ CyberCare - Platform Edukasi Keamanan Siber untuk UMKM

![Status](https://img.shields.io/badge/Status-Demo%20Ready-success?style=flat-square)
![Type](https://img.shields.io/badge/Type-Static%20Website-blue?style=flat-square)

## 📋 Deskripsi Proyek

**CyberCare** adalah platform edukasi keamanan siber yang dirancang khusus untuk **UMKM Indonesia**. Website ini merupakan **demo statis profesional** untuk presentasi dan demo ke dosen/klien.

### Tujuan Platform
- ✅ Memberikan edukasi keamanan siber dengan bahasa mudah dipahami
- ✅ Membantu UMKM melindungi bisnis dari ancaman digital
- ✅ Menyediakan materi interaktif dengan kuis dan simulasi
- ✅ Menampilkan tips keamanan praktis yang bisa langsung diterapkan

**⚠️ PENTING:** Website ini adalah **100% STATIS** - tanpa database, tanpa backend, tanpa autentikasi nyata. Semua data di JSON dan LocalStorage.

## 🎨 Desain & Filosofi

### Visual Design
- **Style:** Modern, Clean, Professional, Luxury
- **Color Palette:** 
  - Primary: Navy Blue (#1e40af) - Kepercayaan & Keamanan
  - Accent: Gold (#d4af37) - Premium & Eksklusif
  - Neutral: Soft Gray - Clean & Modern
  - Success: Green (#10b981) - Positif & Aman
- **Typography:** Inter font (Google Fonts)
- **UI/UX:** Card-based, smooth animations, premium feel

### Target Pengguna
- **Demografi:** Pelaku UMKM, usia 25-50 tahun
- **Tech Level:** Non-teknis, familiar dengan smartphone
- **Kebutuhan:** Tampilan jelas, tidak rumit, informatif

## 🌟 Fitur Lengkap

### 1. 📚 Materi Edukasi (5 Modul)
- **Mengenal Phishing** - Cara mengenali dan menghindari penipuan online
- **Password yang Kuat** - Membuat dan mengelola password aman
- **Transaksi Digital** - Melindungi pembayaran dan rekening bisnis
- **Privasi Data Pelanggan** - Kewajiban UMKM sesuai UU PDP
- **Keamanan Perangkat** - Mengamankan laptop dan smartphone

### 2. 🎯 Kuis Interaktif
- Multiple choice questions (5-7 soal per kuis)
- Feedback langsung dengan penjelasan detail
- Skor akhir dan status lulus/tidak (passing: 70%)
- Tracking history quiz

### 3. ⚠️ Simulasi Ancaman Siber
- Email phishing palsu (Bank, marketplace)
- Pesan WhatsApp penipuan (undian palsu)
- Website login palsu (tokopedia-login.com)
- Interactive "Aman vs Ancaman" button
- Penjelasan edukatif setelah identifikasi

### 4. 💡 Tips Keamanan (20+ Tips)
- Tips harian di dashboard
- Filter berdasarkan kategori:
  - Password, Phishing, Transaksi, Perangkat, Data
- Icon + judul + deskripsi lengkap

### 5. 📊 Dashboard User
- Greeting personal
- Progress pembelajaran (visual circle)
- Statistik (materi selesai, kuis, jam belajar, avg score)
- Activity timeline
- Continue learning section
- Daily security tip

### 6. ⚙️ Admin Dashboard (Demo Only)
- Statistik overview (users, materials, quizzes, avg completion)
- Tabel daftar materials dengan status
- Tabel daftar users dengan progress bar
- Tabel quiz results dengan pass/fail status

## 🗂️ Struktur Project

```
cybercare-umkm/
│
├── frontend/
│   ├── index.html                 # 🏠 Landing page profesional
│   ├── dashboard.html             # 📊 Dashboard user
│   ├── materials.html             # 📚 List semua materi
│   ├── material-detail.html       # 📄 Konten materi lengkap
│   ├── quiz.html                  # 🎯 Interactive quiz
│   ├── simulation.html            # ⚠️ Simulasi ancaman
│   ├── tips.html                  # 💡 Security tips
│   ├── admin.html                 # ⚙️ Admin dashboard
│   │
│   ├── css/
│   │   └── style.css              # Premium CSS (Navy + Gold theme)
│   │
│   ├── js/
│   │   └── main.js                # Core JavaScript functions
│   │
│   └── data/                      # 📁 Static JSON Data
│       ├── materials.json         # 5 materi lengkap
│       ├── quizzes.json           # 5 kuis (30+ questions total)
│       ├── tips.json              # 20 tips keamanan
│       ├── threats.json           # 8 simulasi ancaman
│       └── users.json             # 3 dummy users
│
├── backend/                       # ❌ Tidak digunakan (static demo)
├── prompt.md                      # 📝 Prompt pengembangan lengkap
└── README.md                      # 📖 Dokumentasi ini
```

## 🚀 Cara Menjalankan

### ⭐ Metode 1: Live Server (Recommended)

1. Install ekstensi **Live Server** di VS Code
2. Buka folder project di VS Code
3. Klik kanan `frontend/index.html`
4. Pilih **"Open with Live Server"**
5. Browser otomatis membuka `http://localhost:5500`

### Metode 2: Python HTTP Server

```bash
cd "c:\Users\rhiza\Desktop\cybercare umkm\frontend"
python -m http.server 8000
```

Buka browser: `http://localhost:8000`

### Metode 3: Node.js HTTP Server

```bash
cd "c:\Users\rhiza\Desktop\cybercare umkm\frontend"
npx http-server -p 8000
```

### Metode 4: Double Click (Basic)

Double-click `frontend/index.html` 

⚠️ **Note:** Metode ini mungkin ada masalah CORS saat load JSON. Gunakan metode 1-3 untuk hasil optimal.

## 📱 Panduan Navigasi

### Alur Pengguna Ideal

```
1. Landing Page (index.html)
   ↓
2. Klik "Mulai Belajar"
   ↓
3. Dashboard (dashboard.html) - Overview
   ↓
   ├─→ 4a. Materials → Detail → Quiz
   ├─→ 4b. Simulation → Identifikasi Ancaman
   ├─→ 4c. Tips → Browse Tips
   └─→ 4d. Admin → Lihat Statistik
```

### URL & Query Parameters

| Halaman | URL | Query Params |
|---------|-----|--------------|
| Landing | `index.html` | - |
| Dashboard | `dashboard.html` | - |
| Materials List | `materials.html` | - |
| Material Detail | `material-detail.html` | `?id=1` (1-5) |
| Quiz | `quiz.html` | `?id=1` (1-5) |
| Simulation | `simulation.html` | - |
| Tips | `tips.html` | - |
| Admin | `admin.html` | - |

## 📊 Data & Content

### Materials Data (`materials.json`)

5 materi lengkap dengan struktur:
```json
{
  "id": 1,
  "title": "Judul Materi",
  "category": "Kategori",
  "duration": "10 menit",
  "level": "Pemula/Menengah",
  "icon": "🎣",
  "summary": "Ringkasan...",
  "content": {
    "introduction": "Pendahuluan...",
    "sections": [...],
    "keyTakeaways": [...]
  }
}
```

### Quizzes Data (`quizzes.json`)

5 kuis dengan 5-7 soal per kuis:
```json
{
  "id": 1,
  "materialId": 1,
  "title": "Kuis: ...",
  "passingScore": 70,
  "questions": [
    {
      "question": "Pertanyaan?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "explanation": "Penjelasan..."
    }
  ]
}
```

### User Data (LocalStorage)

Default user dummy:
```json
{
  "name": "Budi Santoso",
  "businessName": "Toko Budi Elektronik",
  "completedMaterials": [1, 2, 3],
  "inProgressMaterials": [4],
  "quizScores": [...],
  "totalLearningHours": 12.5
}
```

## 🎯 Fitur Teknis

### Technology Stack
- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **No Frameworks:** Vanilla JS (zero dependencies)
- **Data Storage:** LocalStorage + Static JSON
- **Icons:** Emoji (universal, no font library)
- **Fonts:** Google Fonts (Inter)
- **Responsive:** Mobile-first approach

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

### Performance
- ⚡ Fast load time (< 2s)
- 📦 Lightweight (no heavy libraries)
- 🎨 Smooth animations (CSS transitions)
- 📱 Responsive images

## 🔧 Customization

### Mengubah Warna Theme

Edit `frontend/css/style.css`:

```css
:root {
    --primary: #1e40af;        /* Your navy blue */
    --gold: #d4af37;           /* Your gold accent */
    --success: #10b981;        /* Your success color */
    /* ... */
}
```

### Menambah Materi Baru

1. Edit `frontend/data/materials.json`
2. Tambah object dengan `id` baru
3. Edit `frontend/data/quizzes.json` untuk quiz terkait
4. Update `totalMaterials` di `main.js` jika perlu

### Menambah Tips

Edit `frontend/data/tips.json`:

```json
{
  "id": 21,
  "icon": "🔐",
  "title": "Judul Tip Baru",
  "description": "Deskripsi lengkap...",
  "category": "Password"
}
```

## 🎓 Educational Value

Platform ini mengajarkan:

1. **Phishing Awareness**
   - Mengenali email/pesan palsu
   - Tanda-tanda link berbahaya
   - Cara verifikasi sender

2. **Password Security**
   - Membuat password kuat (12+ karakter)
   - Password manager
   - Two-factor authentication (2FA)

3. **Transaction Security**
   - Payment gateway aman
   - Verifikasi pembayaran
   - Proteksi OTP/PIN

4. **Data Privacy (UU PDP)**
   - Hak pelanggan atas data
   - Kewajiban UMKM
   - Privacy policy

5. **Device Security**
   - Enkripsi perangkat
   - Update security patches
   - Wi-Fi publik awareness

## 📸 Preview

### Landing Page
Hero section yang menarik dengan CTA jelas, statistik platform, dan fitur unggulan dalam grid 3 kolom.

### Dashboard
Visual progress circle, stats cards, activity timeline, continue learning section, dan daily tips dalam layout yang clean.

### Materials Page
Card-based layout dengan filter (All, Completed, In Progress, Not Started), icon besar, dan status badge.

### Quiz Page
Interactive quiz dengan radio options, feedback setelah submit, explanation box, dan final score card.

## 🚧 Possible Future Development

Jika dikembangkan menjadi aplikasi production:

### Backend Integration
- Node.js/Express atau Python/Flask
- PostgreSQL atau MongoDB
- JWT Authentication
- RESTful API

### Advanced Features
- User registration & real login
- Certificate generation (PDF)
- Leaderboard & gamification
- Forum diskusi
- Email notifications
- Progress export (CSV/PDF)

### Content Management
- Admin CMS untuk edit materi
- Video pembelajaran integration
- Webinar/live class
- Interactive exercises

### Analytics
- Google Analytics integration
- User behavior tracking
- Completion rate dashboard
- A/B testing

## 📝 License

MIT License - Free for educational purposes

## 💼 Use Cases

### 1. Demo ke Dosen
- Presentasi project akhir
- Showcase UI/UX skills
- Demonstrasi fitur interaktif

### 2. Pitch ke Klien/Stakeholder
- Show proof of concept
- Explain business value
- Get funding/approval

### 3. Portfolio Project
- Showcase web development skills
- Demonstrate static site mastery
- Educational tech project

## 🙏 Credits & Acknowledgments

- **Design Inspiration:** Modern SaaS platforms
- **Color Palette:** Navy + Gold luxury theme
- **Target Audience:** UMKM Indonesia 🇮🇩
- **Purpose:** Educational platform demo

## 📞 Support & Contact

Untuk pertanyaan atau demo lebih lanjut:
- 📧 Email: support@cybercare.demo
- 🌐 Website: [Demo Only]
- 📱 WhatsApp: [Demo Only]

---

## ✨ Key Highlights

- 🎨 **Premium Design** - Luxury feel dengan color palette profesional
- 📱 **Fully Responsive** - Optimal di semua device
- ⚡ **Fast & Lightweight** - No heavy dependencies
- 🎯 **User-Centric** - Designed for non-technical UMKM owners
- 📚 **Comprehensive** - 5 materials, 30+ quiz questions, 20+ tips, 8 simulations
- 🎭 **Interactive** - Quiz, simulation, progress tracking
- 🔒 **Privacy-First** - All data in LocalStorage, no external calls
- 💼 **Production-Ready UI** - Siap presentasi & demo

---

**🛡️ Made with ❤️ for UMKM Indonesia**

*Meningkatkan kesadaran keamanan siber, satu UMKM pada satu waktu.*
