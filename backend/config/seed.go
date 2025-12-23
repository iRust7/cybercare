package config

import (
	"crypto/sha256"
	"encoding/hex"
	"log"

	"cybercare-backend/models"
)

// hashPassword creates SHA-256 hash
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// SeedDatabase seeds initial demo data
func SeedDatabase() {
	log.Println("🌱 Checking if database needs seeding...")

	// Check if users already exist
	var count int64
	DB.Model(&models.User{}).Count(&count)

	if count > 0 {
		log.Println("✅ Database already seeded, skipping...")
		return
	}

	log.Println("📊 Seeding demo accounts...")

	// Create demo users
	users := []models.User{
		{
			Name:         "Budi Santoso",
			Email:        "budi@example.com",
			Password:     hashPassword("password123"),
			BusinessName: "Toko Budi Elektronik",
			Role:         "user",
		},
		{
			Name:         "Admin CyberCare",
			Email:        "admin@cybercare.com",
			Password:     hashPassword("admin123"),
			BusinessName: "CyberCare Platform",
			Role:         "admin",
		},
	}

	for _, user := range users {
		if err := DB.Create(&user).Error; err != nil {
			log.Printf("❌ Failed to create user %s: %v", user.Email, err)
			continue
		}

		// Create gamification record
		xp := 0
		level := 1
		if user.Role == "admin" {
			xp = 2500
			level = 5
		} else {
			xp = 150
			level = 2
		}

		gamification := models.UserGamification{
			UserID:      user.ID,
			TotalXP:     xp,
			Level:       level,
			DailyStreak: 0,
		}
		DB.Create(&gamification)

		log.Printf("✅ Created user: %s (%s)", user.Name, user.Email)
	}

	// Seed badges
	badges := []models.Badge{
		{Name: "Materi Pertama", Description: "Menyelesaikan materi pertama", Icon: "📚", RequirementType: "material", RequirementValue: 1},
		{Name: "Mahir Keamanan Siber", Description: "Menyelesaikan semua materi", Icon: "🎓", RequirementType: "material", RequirementValue: 5},
		{Name: "Kuis Pertama", Description: "Menyelesaikan kuis pertama", Icon: "✅", RequirementType: "quiz", RequirementValue: 1},
		{Name: "Master Kuis", Description: "Menyelesaikan semua kuis", Icon: "🏅", RequirementType: "quiz", RequirementValue: 5},
		{Name: "Skor Sempurna", Description: "Mendapat nilai 100 di kuis", Icon: "💯", RequirementType: "score", RequirementValue: 100},
		{Name: "Streak 7 Hari", Description: "Login selama 7 hari berturut-turut", Icon: "🔥", RequirementType: "streak", RequirementValue: 7},
		{Name: "Streak 30 Hari", Description: "Login selama 30 hari berturut-turut", Icon: "⭐", RequirementType: "streak", RequirementValue: 30},
		{Name: "Level 5", Description: "Mencapai level 5", Icon: "🏆", RequirementType: "level", RequirementValue: 5},
		{Name: "Level 10", Description: "Mencapai level 10", Icon: "👑", RequirementType: "level", RequirementValue: 10},
	}

	for _, badge := range badges {
		if err := DB.Create(&badge).Error; err != nil {
			log.Printf("❌ Failed to create badge: %v", err)
			continue
		}
	}

	log.Println("✅ Seeded 9 achievement badges")

	// Seed some materials
	materials := []models.Material{
		{
			Title:       "Pengenalan Keamanan Siber",
			Description: "Dasar-dasar keamanan siber untuk UMKM",
			Content:     "Konten materi pengenalan...",
			Order:       1,
		},
		{
			Title:       "Password Security",
			Description: "Cara membuat dan mengelola password yang aman",
			Content:     "Konten materi password...",
			Order:       2,
		},
		{
			Title:       "Phishing dan Social Engineering",
			Description: "Mengenali dan menghindari serangan phishing",
			Content:     "Konten materi phishing...",
			Order:       3,
		},
	}

	for _, material := range materials {
		if err := DB.Create(&material).Error; err != nil {
			log.Printf("❌ Failed to create material: %v", err)
			continue
		}
	}

	log.Println("✅ Seeded 3 learning materials")

	// Seed quizzes
	quizzes := []models.Quiz{
		{
			Title:       "Quiz Dasar Keamanan Siber",
			Description: "Test pemahaman dasar keamanan siber",
			PassScore:   70,
		},
		{
			Title:       "Quiz Password Security",
			Description: "Test tentang keamanan password",
			PassScore:   70,
		},
	}

	for _, quiz := range quizzes {
		if err := DB.Create(&quiz).Error; err != nil {
			log.Printf("❌ Failed to create quiz: %v", err)
			continue
		}
	}

	log.Println("✅ Seeded 2 quizzes")

	log.Println("🎉 Database seeding completed!")
	log.Println("")
	log.Println("🔑 Demo Credentials:")
	log.Println("   User:  budi@example.com / password123")
	log.Println("   Admin: admin@cybercare.com / admin123")
}

// AutoMigrate creates all tables
func AutoMigrate() {
	log.Println("🔧 Running database migrations...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.UserGamification{},
		&models.Badge{},
		&models.UserBadge{},
		&models.Material{},
		&models.UserMaterial{},
		&models.Quiz{},
		&models.QuizResult{},
	)

	if err != nil {
		log.Fatal("❌ Failed to migrate database:", err)
	}

	log.Println("✅ Database migrations completed")
}

// ResetDatabase drops all tables and recreates them (USE WITH CAUTION!)
func ResetDatabase() {
	log.Println("⚠️  RESETTING DATABASE...")

	// Drop all tables
	DB.Migrator().DropTable(
		&models.QuizResult{},
		&models.UserMaterial{},
		&models.UserBadge{},
		&models.Quiz{},
		&models.Material{},
		&models.Badge{},
		&models.UserGamification{},
		&models.User{},
	)

	log.Println("✅ All tables dropped")

	// Recreate tables
	AutoMigrate()

	// Seed data
	SeedDatabase()
}
