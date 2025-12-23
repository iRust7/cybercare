package main

import (
	"cybercare-backend/config"
	"cybercare-backend/handlers"
	"cybercare-backend/middleware"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin to release mode
	gin.SetMode(gin.ReleaseMode)

	// Create Gin router
	r := gin.Default()

	r.GET("/frontend/admin.html", func(c *gin.Context) {
		c.File("../frontend/admin.html")
	})

	// Initialize database
	config.InitDB()
	defer config.CloseDB()

	// Seed database with demo accounts
	config.SeedDatabase()

	// CORS middleware - Allow all origins for development
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Max-Age", "43200")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		// Public routes (no authentication required)
		api.POST("/login", handlers.Login)
		api.POST("/register", handlers.Register)
		api.POST("/logout", handlers.Logout)
		api.GET("/check_auth", handlers.CheckAuth)

		// Protected routes (JWT authentication required)
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

	// Serve static assets
	r.Static("/frontend/css", "../frontend/css")
	r.Static("/frontend/js", "../frontend/js")
	r.Static("/frontend/data", "../frontend/data")

	// Serve HTML pages
	r.GET("/", func(c *gin.Context) {
		c.File("../frontend/index.html")
	})

	r.GET("/frontend/login.html", func(c *gin.Context) {
		c.File("../frontend/login.html")
	})

	r.GET("/frontend/register.html", func(c *gin.Context) {
		c.File("../frontend/register.html")
	})

	r.GET("/frontend/dashboard.html", func(c *gin.Context) {
		c.File("../frontend/dashboard.html")
	})

	r.GET("/frontend/index.html", func(c *gin.Context) {
		c.File("../frontend/index.html")
	})

	r.GET("/frontend/clear-session.html", func(c *gin.Context) {
		c.File("../frontend/clear-session.html")
	})

	r.GET("/frontend/materials.html", func(c *gin.Context) {
		c.File("../frontend/materials.html")
	})
	r.GET("/frontend/quiz.html", func(c *gin.Context) {
		c.File("../frontend/quiz.html")
	})
	r.GET("/frontend/simulation.html", func(c *gin.Context) {
		c.File("../frontend/simulation.html")
	})
	r.GET("/frontend/profile.html", func(c *gin.Context) {
		c.File("../frontend/profile.html")
	})
	r.GET("/frontend/settings.html", func(c *gin.Context) {
		c.File("../frontend/settings.html")
	})
	r.GET("/frontend/tips.html", func(c *gin.Context) {
		c.File("../frontend/tips.html")
	})
	r.GET("/frontend/material-detail.html", func(c *gin.Context) {
		c.File("../frontend/material-detail.html")
	})

	// fallback: serve any html file in /frontend if exists
	r.GET("/frontend/:file", func(c *gin.Context) {
		file := c.Param("file")
		if len(file) > 5 && file[len(file)-5:] == ".html" {
			c.File("../frontend/" + file)
			return
		}
		c.Status(404)
	})

	r.GET("/frontend", func(c *gin.Context) {
		c.Redirect(302, "/frontend/index.html")
	})

	r.GET("/frontend/", func(c *gin.Context) {
		c.Redirect(302, "/frontend/index.html")
	})

	// Start server
	log.Println("🚀 CyberCare Backend starting on http://localhost:8080")
	log.Println("📚 API endpoints:")
	log.Println("   POST /api/login")
	log.Println("   POST /api/register")
	log.Println("   POST /api/logout")
	log.Println("   GET  /api/check_auth")
	log.Println("   POST /api/award_points (protected)")
	log.Println("   POST /api/update_streak (protected)")
	log.Println("   GET  /api/get_progress (protected)")
	log.Println("   GET  /health")

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
