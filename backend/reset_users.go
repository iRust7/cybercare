package main

import (
	"crypto/sha256"
	"cybercare-backend/config"
	"cybercare-backend/models"
	"encoding/hex"
	"log"
)

func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

func main() {
	// Initialize database
	config.InitDB()
	defer config.CloseDB()

	log.Println("🗑️  Deleting all existing users...")
	config.DB.Exec("DELETE FROM user_badges")
	config.DB.Exec("DELETE FROM quiz_results")
	config.DB.Exec("DELETE FROM user_materials")
	config.DB.Exec("DELETE FROM user_gamification")
	config.DB.Exec("DELETE FROM users")

	log.Println("✅ All users deleted!")
	log.Println("📊 Creating demo accounts...")

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
		if err := config.DB.Create(&user).Error; err != nil {
			log.Printf("❌ Failed to create user %s: %v\n", user.Email, err)
			continue
		}

		// Create gamification record
		gamification := models.UserGamification{
			UserID:      user.ID,
			TotalXP:     0,
			Level:       1,
			DailyStreak: 0,
		}
		config.DB.Create(&gamification)

		log.Printf("✅ Created user: %s (%s)\n", user.Email, user.Role)
	}

	log.Println("\n🎉 Database reset complete!")
	log.Println("📧 Demo Accounts:")
	log.Println("   User:  budi@example.com / password123")
	log.Println("   Admin: admin@cybercare.com / admin123")
}
