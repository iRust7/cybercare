package middleware

import (
	"cybercare-backend/models"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// AuthRequired middleware checks if user is authenticated
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		userID := session.Get("user_id")

		if userID == nil {
			c.JSON(http.StatusUnauthorized, models.Response{
				Success: false,
				Message: "User not authenticated",
			})
			c.Abort()
			return
		}

		// Store userID in context for handlers to use
		c.Set("user_id", userID)
		c.Next()
	}
}
