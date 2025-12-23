-- ============================================
-- CyberCare Database - Complete Setup Script (GORM Compatible)
-- ============================================
-- Run this in phpMyAdmin SQL tab or MySQL command line
-- This version uses plural table names to match GORM conventions

-- Drop and recreate database
DROP DATABASE IF EXISTS cybercare_db;
CREATE DATABASE cybercare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cybercare_db;

-- Users Table
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(150),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Gamifications Table (plural to match GORM)
CREATE TABLE user_gamifications (
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

-- Badges Table
CREATE TABLE badges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    requirement_type VARCHAR(50),
    requirement_value INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Badges Table
CREATE TABLE user_badges (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    badge_id INT UNSIGNED NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Materials Table
CREATE TABLE materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content LONGTEXT,
    `order` INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Materials Progress
CREATE TABLE user_materials (
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

-- Quizzes Table
CREATE TABLE quizzes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    questions LONGTEXT,
    pass_score INT DEFAULT 70,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Results Table
CREATE TABLE quiz_results (
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
-- SEED DEMO DATA
-- ============================================

-- Demo Users (passwords are SHA-256 hashed)
-- budi@example.com / password123
-- admin@cybercare.com / admin123
INSERT INTO users (name, email, password, business_name, role) VALUES
('Budi Santoso', 'budi@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Toko Budi Elektronik', 'user'),
('Admin CyberCare', 'admin@cybercare.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'CyberCare Platform', 'admin');

-- Initialize gamification for users
INSERT INTO user_gamifications (user_id, level, total_xp, daily_streak) VALUES
(1, 1, 0, 0),
(2, 1, 0, 0);

-- Add some badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('Materi Pertama', 'Selesaikan materi pertama', '📚', 'material_complete', 1),
('Mahir Siber', 'Selesaikan semua materi', '🎓', 'material_complete', 5),
('Kuis Pertama', 'Selesaikan kuis pertama', '✅', 'quiz_complete', 1),
('Master Kuis', 'Selesaikan 5 kuis', '🏅', 'quiz_complete', 5),
('Skor Sempurna', 'Dapatkan nilai 100', '💯', 'quiz_perfect', 1),
('Streak 7 Hari', 'Login 7 hari berturut-turut', '🔥', 'daily_streak', 7),
('Streak 30 Hari', 'Login 30 hari berturut-turut', '⭐', 'daily_streak', 30);

-- Add sample materials
INSERT INTO materials (title, description, content, `order`) VALUES
('Pengenalan Phishing', 'Pelajari cara mengenali email dan pesan phishing', 'Konten materi phishing...', 1),
('Keamanan Password', 'Cara membuat dan mengelola password yang aman', 'Konten materi password...', 2),
('Transaksi Digital Aman', 'Panduan bertransaksi online dengan aman', 'Konten materi transaksi...', 3),
('Privasi Data', 'Melindungi data pribadi dan bisnis Anda', 'Konten materi privasi...', 4),
('Keamanan Perangkat', 'Mengamankan smartphone dan komputer bisnis', 'Konten materi perangkat...', 5);

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_badges FROM badges;
SELECT COUNT(*) AS total_materials FROM materials;
