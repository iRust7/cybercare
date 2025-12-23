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
            
            // Optionally verify with backend in background (non-blocking)
            isLoggedIn().then(backendValid => {
                if (!backendValid) {
                    console.warn('⚠️ Backend session invalid, redirecting to login...');
                    alert('Sesi Anda telah berakhir. Silakan login kembali.');
                    window.location.replace('login.html');
                }
            }).catch(err => {
                console.warn('⚠️ Backend check failed:', err);
            });
            
            return; // Allow access
        }
    }
    
    // No valid session found, redirect to login
    console.warn('❌ Authentication Guard: Access denied - redirecting to login');
    alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
    window.location.replace('login.html');
})();
