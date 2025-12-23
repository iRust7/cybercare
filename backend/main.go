package main

import (
	"cybercare-backend/config"
	"cybercare-backend/handlers"
	"cybercare-backend/middleware"
	"encoding/gob"
	"log"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func main() {
	// Register types for session
	gob.Register(uint(0))

	// Initialize database
	config.InitDB()
	defer config.CloseDB()

	// Seed database with demo accounts
	config.SeedDatabase()

	// Set Gin to release mode (change to debug for development)
	gin.SetMode(gin.ReleaseMode)

	// Create Gin router
	r := gin.Default()

	// CORS middleware - Dynamic origin handling for credentials
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Only set CORS headers if Origin is present
		if origin != "" && origin != "null" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
			c.Writer.Header().Set("Access-Control-Max-Age", "43200")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Session middleware
	store := cookie.NewStore([]byte("cybercare-secret-key-change-in-production"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7, // 7 days
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: 0,     // SameSiteDefaultMode - Allow cross-origin
		Domain:   "",    // Empty for localhost
	})
	r.Use(sessions.Sessions("cybercare_session", store))

	// API routes
	api := r.Group("/api")
	{
		// Public routes
		api.POST("/login", handlers.Login)
		api.POST("/register", handlers.Register)
		api.POST("/logout", handlers.Logout)
		api.GET("/check_session", handlers.CheckSession)

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthRequired())
		{
			protected.POST("/award_points", handlers.AwardPoints)
			protected.POST("/update_streak", handlers.UpdateStreak)
			protected.GET("/get_progress", handlers.GetProgress)
		}
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "CyberCare Backend is running",
			"time":    time.Now(),
		})
	})

	// Serve static assets (CSS, JS, images, data) - always accessible
	r.Static("/frontend/css", "../frontend/css")
	r.Static("/frontend/js", "../frontend/js")
	r.Static("/frontend/data", "../frontend/data")

	// Public HTML pages (no authentication required)
	r.GET("/frontend/login.html", func(c *gin.Context) {
		// Check if already logged in
		session := sessions.Default(c)
		if userID := session.Get("user_id"); userID != nil {
			c.Redirect(302, "/frontend/dashboard.html")
			return
		}
		c.File("../frontend/login.html")
	})

	r.GET("/frontend/register.html", func(c *gin.Context) {
		// Check if already logged in
		session := sessions.Default(c)
		if userID := session.Get("user_id"); userID != nil {
			c.Redirect(302, "/frontend/dashboard.html")
			return
		}
		c.File("../frontend/register.html")
	})

	r.GET("/frontend/index.html", func(c *gin.Context) {
		// Check if logged in, redirect to dashboard
		session := sessions.Default(c)
		if userID := session.Get("user_id"); userID != nil {
			c.Redirect(302, "/frontend/dashboard.html")
			return
		}
		c.File("../frontend/index.html")
	})

	// Protected HTML pages (authentication required)
	r.GET("/frontend/dashboard.html", func(c *gin.Context) {
		session := sessions.Default(c)
		if userID := session.Get("user_id"); userID == nil {
			c.Redirect(302, "/frontend/login.html")
			return
		}
		c.File("../frontend/dashboard.html")
	})

	// Root redirect
	r.GET("/", func(c *gin.Context) {
		session := sessions.Default(c)
		if userID := session.Get("user_id"); userID != nil {
			c.Redirect(302, "/frontend/dashboard.html")
		} else {
			c.Redirect(302, "/frontend/index.html")
		}
	})

	// Start server
	log.Println("🚀 CyberCare Backend starting on http://localhost:8080")
	log.Println("📚 API endpoints:")
	log.Println("   POST /api/login")
	log.Println("   POST /api/register")
	log.Println("   POST /api/logout")
	log.Println("   GET  /api/check_session")
	log.Println("   POST /api/award_points")
	log.Println("   POST /api/update_streak")
	log.Println("   GET  /api/get_progress")
	log.Println("   GET  /health")

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
