/**
 * CyberCare - Authentication Guard
 * 
 * Include this script in protected pages to ensure only authenticated users can access them.
 * 
 * Usage:
 * Add these script tags to your HTML (before closing </body>):
 * <script src="js/auth.js"></script>
 * <script src="js/auth-guard.js"></script>
 */

(async function protectPage() {
    console.log('🔐 Authentication Guard: Checking access...');
    
    // Check local session first
    const hasLocalSession = initAuth();
    
    if (hasLocalSession) {
        // Verify session is not expired
        const sessionValid = checkSessionTimeout();
        
        if (sessionValid) {
            console.log('✅ Authentication Guard: Access granted (local session valid)');
            
            // NO LONGER REDIRECTING - Allow guest access
            // Optionally verify with backend in background (non-blocking)
            isLoggedIn().then(backendValid => {
                if (!backendValid) {
                    console.warn('⚠️ Backend session invalid, but allowing guest access');
                    // REMOVED: alert('Sesi Anda telah berakhir. Silakan login kembali.');
                    // REMOVED: window.location.replace('login.html');
                }
            }).catch(err => {
                console.warn('⚠️ Backend check failed, allowing guest access:', err);
            });
            
            return; // Allow access
        }
    }
    
    // No valid session found, redirect to login
    console.warn('❌ Authentication Guard: Access denied - BUT allowing Guest Access');
    // alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
    // window.location.replace('login.html');
    
    // Create guest user if needed
    if (!localStorage.getItem('currentUser')) {
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
        localStorage.setItem('currentUser', JSON.stringify(guestUser));
        // Initialize auth with guest user
        initAuth();
    }
})();
