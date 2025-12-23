package handlers

import (
	"crypto/sha256"
	"cybercare-backend/config"
	"cybercare-backend/middleware"
	"cybercare-backend/models"
	"encoding/hex"
	"math"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// hashPassword creates SHA-256 hash of password
func hashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}

// Login handles user login with JWT
func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Invalid request data",
		})
		return
	}

	// Hash password
	hashedPassword := hashPassword(req.Password)

	// Find user
	var user models.User
	result := config.DB.Where("email = ? AND password = ?", req.Email, hashedPassword).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, models.Response{
			Success: false,
			Message: "Email atau password salah",
		})
		return
	}

	// Update last login
	now := time.Now()
	config.DB.Model(&user).Update("last_login", now)

	// Get gamification data
	var gamification models.UserGamification
	config.DB.Where("user_id = ?", user.ID).First(&gamification)

	// Update streak
	today := time.Now().Format("2006-01-02")
	var lastLoginDate string
	if user.LastLogin != nil {
		lastLoginDate = user.LastLogin.Format("2006-01-02")
	}

	newStreak := gamification.DailyStreak
	if lastLoginDate != today {
		yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
		if lastLoginDate == yesterday {
			newStreak++
		} else if lastLoginDate != "" {
			newStreak = 1
		} else {
			newStreak = 1
		}
		config.DB.Model(&gamification).Update("daily_streak", newStreak)
	}

	// Get user's badges
	var userBadges []models.UserBadge
	config.DB.Preload("Badge").Where("user_id = ?", user.ID).Find(&userBadges)
	badges := []map[string]interface{}{}
	for _, ub := range userBadges {
		badges = append(badges, map[string]interface{}{
			"id":          ub.Badge.ID,
			"name":        ub.Badge.Name,
			"description": ub.Badge.Description,
			"icon":        ub.Badge.Icon,
			"earnedAt":    ub.EarnedAt,
		})
	}

	// Get completed materials
	var completedMaterials []models.UserMaterial
	config.DB.Where("user_id = ? AND status = ?", user.ID, "completed").Find(&completedMaterials)
	completedMaterialIDs := []uint{}
	for _, m := range completedMaterials {
		completedMaterialIDs = append(completedMaterialIDs, m.MaterialID)
	}

	// Get quiz scores
	var quizResults []models.QuizResult
	config.DB.Where("user_id = ?", user.ID).Order("completed_at DESC").Limit(5).Find(&quizResults)
	quizScores := []map[string]interface{}{}
	for _, qr := range quizResults {
		quizScores = append(quizScores, map[string]interface{}{
			"quizId":      qr.QuizID,
			"score":       qr.Score,
			"passed":      qr.Passed,
			"completedAt": qr.CompletedAt,
		})
	}

	// Generate JWT token
	token, err := middleware.GenerateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to generate authentication token",
		})
		return
	}

	// Prepare response
	userData := map[string]interface{}{
		"id":                 user.ID,
		"name":               user.Name,
		"email":              user.Email,
		"businessName":       user.BusinessName,
		"role":               user.Role,
		"xp":                 gamification.TotalXP,
		"level":              gamification.Level,
		"dailyStreak":        newStreak,
		"badges":             badges,
		"completedMaterials": completedMaterialIDs,
		"quizScores":         quizScores,
		"lastActiveDate":     today,
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Login berhasil",
		Data: map[string]interface{}{
			"user":  userData,
			"token": token,
		},
	})
}

// Register handles user registration with JWT
func Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Data tidak valid",
		})
		return
	}

	// Check if email already exists
	var existingUser models.User
	if err := config.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, models.Response{
			Success: false,
			Message: "Email sudah terdaftar",
		})
		return
	}

	// Hash password
	hashedPassword := hashPassword(req.Password)

	// Create user
	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		Password:     hashedPassword,
		BusinessName: req.BusinessName,
		Role:         "user",
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Gagal membuat akun",
		})
		return
	}

	// Create gamification record
	gamification := models.UserGamification{
		UserID:      user.ID,
		TotalXP:     0,
		Level:       1,
		DailyStreak: 0,
	}
	config.DB.Create(&gamification)

	// Generate JWT token
	token, err := middleware.GenerateJWT(user.ID, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to generate authentication token",
		})
		return
	}

	// Prepare response
	userData := map[string]interface{}{
		"id":                 user.ID,
		"name":               user.Name,
		"email":              user.Email,
		"businessName":       user.BusinessName,
		"role":               user.Role,
		"xp":                 0,
		"level":              1,
		"dailyStreak":        0,
		"badges":             []interface{}{},
		"completedMaterials": []interface{}{},
		"quizScores":         []interface{}{},
		"lastActiveDate":     time.Now().Format("2006-01-02"),
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Registrasi berhasil",
		Data: map[string]interface{}{
			"user":  userData,
			"token": token,
		},
	})
}

// Logout handles user logout (client-side token removal)
func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Logout berhasil",
	})
}

// CheckAuth verifies JWT token and returns user data
func CheckAuth(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")

	// No token = not authenticated
	if authHeader == "" {
		c.JSON(http.StatusOK, models.Response{
			Success: true,
			Data: map[string]interface{}{
				"isLoggedIn": false,
			},
		})
		return
	}

	// Parse token
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		c.JSON(http.StatusOK, models.Response{
			Success: true,
			Data: map[string]interface{}{
				"isLoggedIn": false,
			},
		})
		return
	}

	// Validate token
	claims, err := middleware.ValidateJWT(tokenParts[1])
	if err != nil {
		c.JSON(http.StatusOK, models.Response{
			Success: true,
			Data: map[string]interface{}{
				"isLoggedIn": false,
			},
		})
		return
	}

	// Get user data
	var user models.User
	if err := config.DB.First(&user, claims.UserID).Error; err != nil {
		c.JSON(http.StatusOK, models.Response{
			Success: true,
			Data: map[string]interface{}{
				"isLoggedIn": false,
			},
		})
		return
	}

	// Get gamification data
	var gamification models.UserGamification
	config.DB.Where("user_id = ?", user.ID).First(&gamification)

	// Get badges
	var userBadges []models.UserBadge
	config.DB.Preload("Badge").Where("user_id = ?", user.ID).Find(&userBadges)
	badges := []map[string]interface{}{}
	for _, ub := range userBadges {
		badges = append(badges, map[string]interface{}{
			"id":          ub.Badge.ID,
			"name":        ub.Badge.Name,
			"description": ub.Badge.Description,
			"icon":        ub.Badge.Icon,
			"earnedAt":    ub.EarnedAt,
		})
	}

	// Get completed materials
	var completedMaterials []models.UserMaterial
	config.DB.Where("user_id = ? AND status = ?", user.ID, "completed").Find(&completedMaterials)
	completedMaterialIDs := []uint{}
	for _, m := range completedMaterials {
		completedMaterialIDs = append(completedMaterialIDs, m.MaterialID)
	}

	// Get quiz scores
	var quizResults []models.QuizResult
	config.DB.Where("user_id = ?", user.ID).Order("completed_at DESC").Limit(5).Find(&quizResults)
	quizScores := []map[string]interface{}{}
	for _, qr := range quizResults {
		quizScores = append(quizScores, map[string]interface{}{
			"quizId":      qr.QuizID,
			"score":       qr.Score,
			"passed":      qr.Passed,
			"completedAt": qr.CompletedAt,
		})
	}

	userData := map[string]interface{}{
		"id":                 user.ID,
		"name":               user.Name,
		"email":              user.Email,
		"businessName":       user.BusinessName,
		"role":               user.Role,
		"xp":                 gamification.TotalXP,
		"level":              gamification.Level,
		"dailyStreak":        gamification.DailyStreak,
		"badges":             badges,
		"completedMaterials": completedMaterialIDs,
		"quizScores":         quizScores,
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Data: map[string]interface{}{
			"isLoggedIn": true,
			"user":       userData,
		},
	})
}

// AwardPoints handles awarding XP points to user
func AwardPoints(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req models.AwardPointsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Invalid request data",
		})
		return
	}

	// Get current gamification data
	var gamification models.UserGamification
	if err := config.DB.Where("user_id = ?", userID).First(&gamification).Error; err != nil {
		c.JSON(http.StatusNotFound, models.Response{
			Success: false,
			Message: "User gamification data not found",
		})
		return
	}

	// Calculate new XP and level
	newXP := gamification.TotalXP + req.Points
	newLevel := int(math.Floor(math.Sqrt(float64(newXP) / 100)))
	if newLevel < 1 {
		newLevel = 1
	}
	leveledUp := newLevel > gamification.Level

	// Update gamification
	config.DB.Model(&gamification).Updates(map[string]interface{}{
		"total_xp": newXP,
		"level":    newLevel,
	})

	// Check for level-based badges
	newBadges := []map[string]interface{}{}
	if leveledUp {
		var badges []models.Badge
		config.DB.Where("requirement_type = ? AND requirement_value <= ?", "level", newLevel).Find(&badges)

		for _, badge := range badges {
			var existingBadge models.UserBadge
			if err := config.DB.Where("user_id = ? AND badge_id = ?", userID, badge.ID).First(&existingBadge).Error; err != nil {
				userBadge := models.UserBadge{
					UserID:  userID,
					BadgeID: badge.ID,
				}
				config.DB.Create(&userBadge)

				newBadges = append(newBadges, map[string]interface{}{
					"id":          badge.ID,
					"name":        badge.Name,
					"description": badge.Description,
					"icon":        badge.Icon,
				})
			}
		}
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Points awarded successfully",
		Data: map[string]interface{}{
			"pointsAwarded": req.Points,
			"newXP":         newXP,
			"newLevel":      newLevel,
			"leveledUp":     leveledUp,
			"newBadges":     newBadges,
		},
	})
}

// UpdateStreak handles daily streak update
func UpdateStreak(c *gin.Context) {
	userID := c.GetUint("user_id")

	var user models.User
	config.DB.First(&user, userID)

	var gamification models.UserGamification
	config.DB.Where("user_id = ?", userID).First(&gamification)

	today := time.Now().Format("2006-01-02")
	var lastLoginDate string
	if user.LastLogin != nil {
		lastLoginDate = user.LastLogin.Format("2006-01-02")
	}

	oldStreak := gamification.DailyStreak
	newStreak := oldStreak
	streakContinued := false

	if lastLoginDate != today {
		yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
		if lastLoginDate == yesterday {
			newStreak++
			streakContinued = true
		} else if lastLoginDate != "" {
			newStreak = 1
		} else {
			newStreak = 1
			streakContinued = true
		}

		config.DB.Model(&gamification).Update("daily_streak", newStreak)
		now := time.Now()
		config.DB.Model(&user).Update("last_login", now)
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Streak updated successfully",
		Data: map[string]interface{}{
			"oldStreak":       oldStreak,
			"newStreak":       newStreak,
			"streakContinued": streakContinued,
		},
	})
}

// GetProgress retrieves user's progress data
func GetProgress(c *gin.Context) {
	userID := c.GetUint("user_id")

	var gamification models.UserGamification
	config.DB.Where("user_id = ?", userID).First(&gamification)

	var badgeCount int64
	config.DB.Model(&models.UserBadge{}).Where("user_id = ?", userID).Count(&badgeCount)

	var userBadges []models.UserBadge
	config.DB.Preload("Badge").Where("user_id = ?", userID).Order("earned_at DESC").Find(&userBadges)
	badges := []map[string]interface{}{}
	for _, ub := range userBadges {
		badges = append(badges, map[string]interface{}{
			"id":          ub.Badge.ID,
			"name":        ub.Badge.Name,
			"description": ub.Badge.Description,
			"icon":        ub.Badge.Icon,
			"earnedAt":    ub.EarnedAt,
		})
	}

	var completedMaterials int64
	config.DB.Model(&models.UserMaterial{}).Where("user_id = ? AND status = ?", userID, "completed").Count(&completedMaterials)

	var quizAttempts int64
	config.DB.Model(&models.QuizResult{}).Where("user_id = ?", userID).Count(&quizAttempts)

	var avgScore float64
	config.DB.Model(&models.QuizResult{}).Where("user_id = ?", userID).Select("AVG(score)").Scan(&avgScore)

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Progress data retrieved successfully",
		Data: map[string]interface{}{
			"xp":                 gamification.TotalXP,
			"level":              gamification.Level,
			"streak":             gamification.DailyStreak,
			"badgeCount":         badgeCount,
			"completedMaterials": completedMaterials,
			"quizAttempts":       quizAttempts,
			"avgQuizScore":       math.Round(avgScore*100) / 100,
			"badges":             badges,
		},
	})
}
