package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	Name         string     `gorm:"size:100;not null" json:"name"`
	Email        string     `gorm:"size:100;unique;not null" json:"email"`
	Password     string     `gorm:"size:255;not null" json:"-"`
	BusinessName string     `gorm:"size:100" json:"businessName"`
	Role         string     `gorm:"size:20;default:user" json:"role"`
	LastLogin    *time.Time `json:"lastLogin"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`

	// Relationships
	Gamification UserGamification `gorm:"foreignKey:UserID" json:"gamification,omitempty"`
	Badges       []UserBadge      `gorm:"foreignKey:UserID" json:"badges,omitempty"`
	Materials    []UserMaterial   `gorm:"foreignKey:UserID" json:"materials,omitempty"`
	QuizResults  []QuizResult     `gorm:"foreignKey:UserID" json:"quizResults,omitempty"`
}

// UserGamification represents user's gamification data
type UserGamification struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"unique;not null" json:"userId"`
	TotalXP     int       `gorm:"default:0" json:"totalXp"`
	Level       int       `gorm:"default:1" json:"level"`
	DailyStreak int       `gorm:"default:0" json:"dailyStreak"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// Badge represents an achievement badge
type Badge struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Name             string    `gorm:"size:100;not null" json:"name"`
	Description      string    `gorm:"type:text" json:"description"`
	Icon             string    `gorm:"size:50" json:"icon"`
	RequirementType  string    `gorm:"size:50" json:"requirementType"`
	RequirementValue int       `json:"requirementValue"`
	CreatedAt        time.Time `json:"createdAt"`
}

// UserBadge represents a badge earned by a user
type UserBadge struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	UserID   uint      `gorm:"not null" json:"userId"`
	BadgeID  uint      `gorm:"not null" json:"badgeId"`
	EarnedAt time.Time `gorm:"autoCreateTime" json:"earnedAt"`
	Badge    Badge     `gorm:"foreignKey:BadgeID" json:"badge,omitempty"`
}

// Material represents learning material
type Material struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"size:200;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Content     string    `gorm:"type:longtext" json:"content"`
	Order       int       `json:"order"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// UserMaterial represents user's material progress
type UserMaterial struct {
	ID                 uint       `gorm:"primaryKey" json:"id"`
	UserID             uint       `gorm:"not null" json:"userId"`
	MaterialID         uint       `gorm:"not null" json:"materialId"`
	Status             string     `gorm:"size:20;default:not_started" json:"status"`
	ProgressPercentage int        `gorm:"default:0" json:"progressPercentage"`
	LastAccessed       *time.Time `json:"lastAccessed"`
	CompletedAt        *time.Time `json:"completedAt"`
	Material           Material   `gorm:"foreignKey:MaterialID" json:"material,omitempty"`
}

// Quiz represents a quiz
type Quiz struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"size:200;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Questions   string    `gorm:"type:longtext" json:"questions"`
	PassScore   int       `gorm:"default:70" json:"passScore"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// QuizResult represents a user's quiz result
type QuizResult struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"not null" json:"userId"`
	QuizID      uint      `gorm:"not null" json:"quizId"`
	Score       int       `json:"score"`
	Passed      bool      `json:"passed"`
	CompletedAt time.Time `gorm:"autoCreateTime" json:"completedAt"`
	Quiz        Quiz      `gorm:"foreignKey:QuizID" json:"quiz,omitempty"`
}

// LoginRequest represents login request payload
type LoginRequest struct {
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"rememberMe"`
}

// RegisterRequest represents registration request payload
type RegisterRequest struct {
	Name         string `json:"name" binding:"required"`
	Email        string `json:"email" binding:"required,email"`
	Password     string `json:"password" binding:"required,min=6"`
	BusinessName string `json:"businessName"`
}

// AwardPointsRequest represents award points request payload
type AwardPointsRequest struct {
	Points int    `json:"points" binding:"required,min=1"`
	Reason string `json:"reason"`
}

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
