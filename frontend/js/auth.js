// ============================================
// CyberCare - Clean JWT Authentication System
// ============================================

const API_BASE_URL = '/api';
const TOKEN_KEY = 'cybercare_token';
const USER_KEY = 'cybercare_user';

// ============================================
// TOKEN MANAGEMENT
// ============================================

// Store auth token
function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Get auth token
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Remove auth token
function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Store user data
function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get user data
function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

// Remove user data
function removeUser() {
    localStorage.removeItem(USER_KEY);
}

// Clear all auth data
function clearAuth() {
    removeToken();
    removeUser();
    localStorage.removeItem('guestMode');
}

// ============================================
// API CALLS
// ============================================

// Login
async function login(email, password) {
    try {
        console.log('🔐 Login: Making API call to', `${API_BASE_URL}/login`);
        
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('📡 Login: Response status:', response.status);
        
        const result = await response.json();
        console.log('📦 Login: Response data:', result);

        if (result.success && result.data) {
            console.log('✅ Login: Setting token and user data');
            setToken(result.data.token);
            setUser(result.data.user);
            console.log('✅ Login: Token and user saved');
            return { success: true, user: result.data.user };
        }

        console.warn('❌ Login: Failed -', result.message);
        return { success: false, message: result.message || 'Login gagal' };
    } catch (error) {
        console.error('💥 Login: Exception caught:', error);
        return { success: false, message: 'Terjadi kesalahan saat login' };
    }
}

// Register
async function register(name, email, password, businessName) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, businessName })
        });

        const result = await response.json();

        if (result.success && result.data) {
            setToken(result.data.token);
            setUser(result.data.user);
            return { success: true, user: result.data.user };
        }

        return { success: false, message: result.message || 'Registrasi gagal' };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'Terjadi kesalahan saat mendaftar' };
    }
}

// Logout
async function logout() {
    try {
        const token = getToken();
        if (token) {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuth();
        window.location.href = '/frontend/login.html';
    }
}

// Check if user is authenticated
async function checkAuth() {
    const token = getToken();
    
    if (!token) {
        return { isLoggedIn: false };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/check_auth`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success && result.data && result.data.isLoggedIn) {
            setUser(result.data.user);
            return { isLoggedIn: true, user: result.data.user };
        }

        // Token invalid, clear auth
        clearAuth();
        return { isLoggedIn: false };
    } catch (error) {
        console.error('Check auth error:', error);
        return { isLoggedIn: false };
    }
}

// Alias for backward compatibility
async function isAuthenticated() {
    console.log('🔍 isAuthenticated: Checking authentication status...');
    const authResult = await checkAuth();
    console.log('🔍 isAuthenticated: Result:', authResult);
    return authResult.isLoggedIn;
}

// ============================================
// GUEST MODE
// ============================================

function enableGuestMode() {
    const guestUser = {
        id: 0,
        name: "Pengunjung Tamu",
        email: "tamu@cybercare.com",
        businessName: "Bisnis Tamu",
        role: "user",
        xp: 0,
        level: 1,
        dailyStreak: 0,
        badges: [],
        completedMaterials: [],
        quizScores: []
    };
    
    setUser(guestUser);
    localStorage.setItem('guestMode', 'true');
    return guestUser;
}

function isGuestMode() {
    return localStorage.getItem('guestMode') === 'true';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current user (from localStorage)
function getCurrentUser() {
    return getUser();
}

// Check if logged in (quick check without API call)
function isLoggedIn() {
    return !!getToken() || isGuestMode();
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.login = login;
    window.register = register;
    window.logout = logout;
    window.checkAuth = checkAuth;
    window.isAuthenticated = isAuthenticated;
    window.getCurrentUser = getCurrentUser;
    window.isLoggedIn = isLoggedIn;
    window.enableGuestMode = enableGuestMode;
    window.isGuestMode = isGuestMode;
    window.clearAuth = clearAuth;
}
