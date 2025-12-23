// CyberCare - Authentication System
// Backend API Integration with Enhanced Security

// ============================================
// AUTHENTICATION SYSTEM
// ============================================

// Store current user in memory
let currentUserData = null;
let authToken = null;
let sessionExpiry = null;

// API Base URL - Points to Go backend server
const API_BASE_URL = 'http://localhost:8080/api';

// Session timeout duration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Initialize authentication on page load
function initAuth() {
    console.log('🔄 Initializing authentication...');
    
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    const storedExpiry = localStorage.getItem('sessionExpiry');
    
    console.log('📦 LocalStorage check:', {
        hasUser: !!storedUser,
        hasToken: !!storedToken,
        hasExpiry: !!storedExpiry
    });
    
    if (storedUser && storedToken && storedExpiry) {
        const expiryTime = parseInt(storedExpiry);
        const now = Date.now();
        
        console.log('⏰ Session timing:', {
            expiry: new Date(expiryTime).toLocaleString(),
            now: new Date(now).toLocaleString(),
            isValid: now < expiryTime
        });
        
        if (now < expiryTime) {
            // Session still valid
            currentUserData = JSON.parse(storedUser);
            authToken = storedToken;
            sessionExpiry = expiryTime;
            
            console.log('✅ Session restored:', {
                user: currentUserData?.name,
                email: currentUserData?.email
            });
            
            // Reset session timeout
            resetSessionTimeout();
            return true;
        } else {
            // Session expired, clear data
            console.warn('❌ Session expired, clearing data');
            clearAuthData();
        }
    } else {
        console.log('ℹ️ No stored session found');
    }
    return false;
}

// Clear authentication data
function clearAuthData() {
    currentUserData = null;
    authToken = null;
    sessionExpiry = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('rememberMe');
}

// Reset session timeout
function resetSessionTimeout() {
    const newExpiry = Date.now() + SESSION_TIMEOUT;
    sessionExpiry = newExpiry;
    localStorage.setItem('sessionExpiry', newExpiry.toString());
}

// Get authentication headers
function getAuthHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return headers;
}

// Register new user
async function handleRegister(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            currentUserData = result.data.user;
            
            // Store authentication token if provided
            if (result.data.token) {
                authToken = result.data.token;
                localStorage.setItem('authToken', authToken);
            }
            
            // Set session expiry
            resetSessionTimeout();
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            
            return {
                success: true,
                user: currentUserData
            };
        } else {
            return {
                success: false,
                message: result.message || 'Registrasi gagal'
            };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
        };
    }
}

// Login user
async function handleLogin(email, password, rememberMe = false) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            currentUserData = result.data.user;
            
            // Store authentication token
            if (result.data.token) {
                authToken = result.data.token;
                localStorage.setItem('authToken', authToken);
            }
            
            // Set session expiry
            resetSessionTimeout();
            
            // Store user data
            localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Log successful login for security audit
            console.log('Login successful:', {
                user: currentUserData.name,
                email: currentUserData.email,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: true,
                user: currentUserData
            };
        } else {
            // Log failed login attempt
            console.warn('Login failed:', {
                email: email,
                timestamp: new Date().toISOString()
            });
            
            return {
                success: false,
                message: result.message || 'Email atau password salah'
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat login. Silakan coba lagi.'
        };
    }
}

// Logout user
async function handleLogout() {
    try {
        // Notify backend of logout
        await fetch(`${API_BASE_URL}/logout`, { 
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        // Log logout for security audit
        console.log('User logged out:', {
            user: currentUserData?.name,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Clear all authentication data
    clearAuthData();
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check if user is logged in (async)
async function isLoggedIn() {
    // First check local session
    if (!initAuth()) {
        return false;
    }
    
    try {
        // Verify session with backend
        const response = await fetch(`${API_BASE_URL}/check_session`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.isLoggedIn) {
            // Update user data from backend
            if (result.data.user) {
                currentUserData = result.data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            }
            
            // Reset session timeout on activity
            resetSessionTimeout();
            
            return true;
        }
        
        // Session invalid, clear data
        clearAuthData();
        return false;
    } catch (error) {
        console.error('Session check error:', error);
        // On error, trust local session if not expired
        if (sessionExpiry && Date.now() < sessionExpiry) {
            return true;
        }
        return false;
    }
}

// Get user profile
function getUserProfile(userId) {
    return currentUserData;
}

// Get current user (from memory, set by isLoggedIn)
function getCurrentUser() {
    return currentUserData;
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    // At least 8 characters
    if (password.length < 8) {
        return { valid: false, message: 'Password minimal 8 karakter' };
    }
    
    // Contains letters and numbers
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasLetters || !hasNumbers) {
        return { valid: false, message: 'Password harus mengandung huruf dan angka' };
    }
    
    return { valid: true, message: 'Password valid' };
}

// Check session timeout and refresh if needed
function checkSessionTimeout() {
    console.log('🕐 Checking session timeout...');
    console.log('📅 Session expiry:', sessionExpiry ? new Date(sessionExpiry).toLocaleString() : 'Not set');
    
    if (!sessionExpiry) {
        console.warn('⚠️ No session expiry found');
        return false;
    }
    
    const now = Date.now();
    const timeLeft = sessionExpiry - now;
    
    console.log('⏱️ Time left:', Math.floor(timeLeft / 1000), 'seconds');
    
    // If less than 5 minutes left, warn user
    if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
        console.warn('⚠️ Session will expire soon. Time left:', Math.floor(timeLeft / 1000), 'seconds');
    }
    
    // If expired, return false (don't auto-logout here, let caller handle it)
    if (timeLeft <= 0) {
        console.warn('❌ Session expired');
        return false;
    }
    
    console.log('✅ Session is valid');
    return true;
}

// Initialize authentication check on page load
if (typeof window !== 'undefined') {
    // Check session timeout every minute
    setInterval(checkSessionTimeout, 60000);
    
    // Reset session timeout on user activity
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            if (currentUserData && sessionExpiry) {
                resetSessionTimeout();
            }
        }, { passive: true, once: false });
    });
}

// Expose functions to window
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.awardPoints = awardPoints;
window.awardBadge = awardBadge;
window.getLevelInfo = getLevelInfo;
window.updateUserData = updateUserData;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.initAuth = initAuth;
window.checkSessionTimeout = checkSessionTimeout;

// Generate simple token
function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Generate avatar (first letter of name)
function generateAvatar(name) {
    return name.charAt(0).toUpperCase();
}

// ============================================
// GAMIFICATION SYSTEM
// ============================================

// XP and Level System
const LEVEL_CONFIG = {
    1: { xpRequired: 0, title: 'Pemula' },
    2: { xpRequired: 100, title: 'Pelajar' },
    3: { xpRequired: 250, title: 'Praktisi' },
    4: { xpRequired: 500, title: 'Ahli' },
    5: { xpRequired: 1000, title: 'Master' },
    6: { xpRequired: 2000, title: 'Guardian' },
    7: { xpRequired: 4000, title: 'Legend' }
};

// Points for actions
const POINTS_CONFIG = {
    completeMaterial: 50,
    passQuiz: 75,
    perfectQuiz: 100,
    completeSimulation: 30,
    readTip: 5,
    dailyLogin: 10,
    weekStreak: 50,
    monthStreak: 200
};

// Award points and XP
async function awardPoints(action, extraPoints = 0) {
    try {
        const response = await fetch(`${API_BASE_URL}/award_points`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, extraPoints })
        });
        
        const result = await response.json();
        if (result.success) {
            // Update local user data
            if (currentUserData) {
                currentUserData.xp = result.data.newXP;
                currentUserData.level = result.data.newLevel;
                localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            }
            
            if (window.CyberCareUI && window.CyberCareUI.Toast) {
                CyberCareUI.Toast.show(`+${result.data.points} XP! Total: ${result.data.newXP} XP`, 'success');
            }
            return result.data;
        }
    } catch (error) {
        console.error('Error awarding points:', error);
    }
    return null;
}

// Award badge (Stub - Backend handles this usually, or we need an endpoint)
function awardBadge(badgeId, badgeName) {
    // This should ideally be handled by the backend when conditions are met
    console.log('Award badge called:', badgeId, badgeName);
}

// Get badge icon
function getBadgeIcon(badgeId) {
    const icons = {
        'first_material': '📚',
        'all_materials': '🎓',
        'first_quiz': '✅',
        'quiz_master': '🏅',
        'perfect_score': '💯',
        'week_streak': '🔥',
        'month_streak': '⭐',
        'early_adopter': '🌟',
        'security_champion': '🛡️'
    };
    
    if (badgeId.startsWith('level_')) {
        return '🏆';
    }
    
    return icons[badgeId] || '🎖️';
}

// Update daily streak
async function updateDailyStreak() {
    try {
        const response = await fetch(`${API_BASE_URL}/update_streak`, {
            method: 'POST'
        });
        
        const result = await response.json();
        if (result.success && currentUserData) {
            currentUserData.dailyStreak = result.data.streak;
            localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            return {
                newStreak: result.data.streak,
                streakContinued: true 
            };
        }
    } catch (error) {
        console.error('Error updating streak:', error);
    }
    return null;
}

// Check and award achievements
function checkAchievements() {
    // This can be expanded to check various achievements
    console.log('Checking achievements...');
}

// Get level info
function getLevelInfo(user) {
    const currentLevel = user.level;
    const nextLevel = currentLevel + 1;
    
    const currentLevelXP = LEVEL_CONFIG[currentLevel]?.xpRequired || 0;
    const nextLevelXP = LEVEL_CONFIG[nextLevel]?.xpRequired || currentLevelXP;
    
    const xpInCurrentLevel = user.xp - currentLevelXP;
    const xpNeededForNext = nextLevelXP - currentLevelXP;
    const progress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;
    
    return {
        currentLevel,
        nextLevel,
        currentLevelTitle: LEVEL_CONFIG[currentLevel]?.title || 'Pemula',
        nextLevelTitle: LEVEL_CONFIG[nextLevel]?.title || 'Max',
        currentXP: user.xp,
        xpNeededForNext: nextLevelXP,
        xpInCurrentLevel,
        xpToNextLevel: nextLevelXP - user.xp,
        progress: Math.min(progress, 100)
    };
}

// Update user data (sync with localStorage)
function updateUserData(updates) {
    if (!currentUserData) return null;
    
    // Update local copy
    currentUserData = { ...currentUserData, ...updates };
    
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    
    return currentUserData;
}

// Note: Each page now handles its own authentication check
// This prevents race conditions and ensures proper async handling
