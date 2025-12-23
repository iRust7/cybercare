-- ============================================
-- Add Missing Tables to Existing Database
-- ============================================
-- This will add all missing tables WITHOUT dropping existing users
-- Run this in phpMyAdmin or MySQL command line

USE cybercare_db;

-- ============================================
-- 1. User Gamifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_gamifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    level INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    daily_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_gamification (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialize gamification for existing users
INSERT IGNORE INTO user_gamifications (user_id, level, total_xp, daily_streak) 
SELECT id, 1, 0, 0 FROM users;

-- ============================================
-- 2. Badges Table
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    requirement_type VARCHAR(50),
    requirement_value INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default badges
INSERT IGNORE INTO badges (id, name, description, icon, requirement_type, requirement_value) VALUES
(1, 'Materi Pertama', 'Selesaikan materi pertama', '📚', 'material_complete', 1),
(2, 'Mahir Siber', 'Selesaikan semua materi', '🎓', 'material_complete', 5),
(3, 'Kuis Pertama', 'Selesaikan kuis pertama', '✅', 'quiz_complete', 1),
(4, 'Master Kuis', 'Selesaikan 5 kuis', '🏅', 'quiz_complete', 5),
(5, 'Skor Sempurna', 'Dapatkan nilai 100', '💯', 'quiz_perfect', 1),
(6, 'Streak 7 Hari', 'Login 7 hari berturut-turut', '🔥', 'daily_streak', 7),
(7, 'Streak 30 Hari', 'Login 30 hari berturut-turut', '⭐', 'daily_streak', 30);

-- ============================================
-- 3. User Badges Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    badge_id INT UNSIGNED NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. Materials Table
-- ============================================
CREATE TABLE IF NOT EXISTS materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content LONGTEXT,
    `order` INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample materials
INSERT IGNORE INTO materials (id, title, description, content, `order`) VALUES
(1, 'Pengenalan Phishing', 'Pelajari cara mengenali email dan pesan phishing yang berbahaya', 
'<h2>Apa itu Phishing?</h2><p>Phishing adalah upaya penipuan untuk mendapatkan informasi sensitif seperti username, password, dan data kartu kredit dengan menyamar sebagai entitas terpercaya.</p>
<h3>Cara Mengenali Phishing:</h3>
<ul>
<li>Email dari pengirim tidak dikenal atau mencurigakan</li>
<li>Permintaan informasi pribadi atau password</li>
<li>Link yang mengarah ke website palsu</li>
<li>Kesalahan ejaan dan tata bahasa</li>
<li>Penawaran yang terlalu bagus untuk jadi kenyataan</li>
</ul>', 1),

(2, 'Keamanan Password', 'Cara membuat dan mengelola password yang kuat dan aman',
'<h2>Password yang Kuat</h2><p>Password yang kuat adalah pertahanan pertama Anda terhadap akses tidak sah.</p>
<h3>Tips Password Aman:</h3>
<ul>
<li>Minimal 12 karakter</li>
<li>Kombinasi huruf besar, kecil, angka, dan simbol</li>
<li>Jangan gunakan informasi pribadi</li>
<li>Berbeda untuk setiap akun</li>
<li>Gunakan password manager</li>
<li>Aktifkan 2FA (Two-Factor Authentication)</li>
</ul>', 2),

(3, 'Transaksi Digital Aman', 'Panduan bertransaksi online dengan aman untuk bisnis UMKM',
'<h2>Keamanan Transaksi Online</h2><p>Bertransaksi online dengan aman sangat penting untuk melindungi bisnis Anda.</p>
<h3>Langkah-langkah Aman:</h3>
<ul>
<li>Pastikan website menggunakan HTTPS</li>
<li>Gunakan payment gateway terpercaya</li>
<li>Jangan simpan data kartu kredit</li>
<li>Verifikasi identitas pembeli</li>
<li>Gunakan rekening khusus bisnis</li>
<li>Monitor transaksi secara berkala</li>
</ul>', 3),

(4, 'Privasi Data', 'Melindungi data pribadi dan bisnis dari kebocoran',
'<h2>Perlindungan Data Pribadi</h2><p>Data adalah aset berharga yang harus dilindungi dengan baik.</p>
<h3>Cara Melindungi Data:</h3>
<ul>
<li>Enkripsi data sensitif</li>
<li>Backup data secara rutin</li>
<li>Batasi akses ke data penting</li>
<li>Hapus data yang tidak diperlukan</li>
<li>Gunakan cloud storage terpercaya</li>
<li>Patuhi regulasi perlindungan data</li>
</ul>', 4),

(5, 'Keamanan Perangkat', 'Mengamankan smartphone dan komputer untuk bisnis',
'<h2>Keamanan Perangkat Digital</h2><p>Perangkat yang aman adalah fondasi keamanan bisnis digital Anda.</p>
<h3>Checklist Keamanan:</h3>
<ul>
<li>Install antivirus dan firewall</li>
<li>Update sistem operasi secara rutin</li>
<li>Gunakan screen lock</li>
<li>Enkripsi hard drive</li>
<li>Hati-hati dengan USB dan download</li>
<li>Backup data penting</li>
<li>Gunakan VPN untuk koneksi publik</li>
</ul>', 5);

-- ============================================
-- 5. User Materials Progress Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    material_id INT UNSIGNED NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started',
    progress_percentage INT DEFAULT 0,
    last_accessed TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_material (user_id, material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Quizzes Table
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    questions LONGTEXT,
    pass_score INT DEFAULT 70,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample quizzes (can be expanded later)
INSERT IGNORE INTO quizzes (id, title, description, pass_score) VALUES
(1, 'Kuis Phishing', 'Uji pemahaman Anda tentang phishing', 70),
(2, 'Kuis Keamanan Password', 'Test pengetahuan password aman', 70),
(3, 'Kuis Transaksi Digital', 'Evaluasi pengetahuan transaksi online', 70),
(4, 'Kuis Privasi Data', 'Tes pemahaman perlindungan data', 70),
(5, 'Kuis Keamanan Perangkat', 'Uji pengetahuan keamanan device', 70);

-- ============================================
-- 7. Quiz Results Table
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    quiz_id INT UNSIGNED NOT NULL,
    score INT NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_user_quiz (user_id, quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'All missing tables added successfully!' AS status;

-- Show all tables
SHOW TABLES;

-- Count records
SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM user_gamifications) as gamifications,
    (SELECT COUNT(*) FROM badges) as badges,
    (SELECT COUNT(*) FROM materials) as materials,
    (SELECT COUNT(*) FROM quizzes) as quizzes;
