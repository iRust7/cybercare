-- CyberCare Database Schema
-- Run this in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS cybercare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cybercare_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(150),
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Gamification Table
CREATE TABLE IF NOT EXISTS user_gamification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    total_points INT DEFAULT 0,
    daily_streak INT DEFAULT 0,
    last_active_date DATE,
    total_learning_hours DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_gamification (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id VARCHAR(50) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    content TEXT,
    duration VARCHAR(20),
    xp_reward INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Materials Progress
CREATE TABLE IF NOT EXISTS user_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    material_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_material (user_id, material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    pass_score INT DEFAULT 70,
    xp_reward INT DEFAULT 75,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Results Table
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_user_quiz (user_id, quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Demo Users (passwords are SHA-256 hashed)
INSERT INTO users (name, email, password, business_name, role, avatar, last_login) VALUES
('Budi Santoso', 'budi@example.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'Toko Budi Elektronik', 'user', 'B', NULL),
('Admin CyberCare', 'admin@cybercare.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'CyberCare Platform', 'admin', 'A', NULL)
ON DUPLICATE KEY UPDATE name=name;

-- Initialize gamification for demo users
INSERT INTO user_gamification (user_id, level, xp, total_points, daily_streak, last_active_date, total_learning_hours)
SELECT id, 1, 0, 0, 0, CURDATE(), 0.00 FROM users
ON DUPLICATE KEY UPDATE user_id=user_id;

-- Insert Badge Definitions
INSERT INTO badges (badge_id, name, description, icon) VALUES
('first_material', 'Materi Pertama', 'Menyelesaikan materi pertama', '📚'),
('all_materials', 'Mahir Keamanan Siber', 'Menyelesaikan semua materi', '🎓'),
('first_quiz', 'Kuis Pertama', 'Menyelesaikan kuis pertama', '✅'),
('quiz_master', 'Master Kuis', 'Menyelesaikan semua kuis', '🏅'),
('perfect_score', 'Skor Sempurna', 'Mendapat nilai 100 di kuis', '💯'),
('week_streak', 'Streak 7 Hari', 'Login selama 7 hari berturut-turut', '🔥'),
('month_streak', 'Streak 30 Hari', 'Login selama 30 hari berturut-turut', '⭐')
ON DUPLICATE KEY UPDATE name=name;
