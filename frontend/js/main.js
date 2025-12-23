// CyberCare - Main JavaScript File
// Static data loading, navigation, and utility functions

// Initialize LocalStorage with default user data if not exists
function initializeUserData() {
    if (!localStorage.getItem('currentUser')) {
        const defaultUser = {
            id: 1,
            name: 'Budi Santoso',
            businessName: 'Toko Budi Elektronik',
            completedMaterials: [1, 2, 3],
            inProgressMaterials: [4],
            quizScores: [
                { quizId: 1, score: 80, passed: true, completedAt: '2024-02-10' },
                { quizId: 2, score: 90, passed: true, completedAt: '2024-03-05' },
                { quizId: 3, score: 75, passed: true, completedAt: '2024-04-12' }
            ],
            totalLearningHours: 12.5,
            lastActive: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    }
}

// Load JSON data
async function loadJSON(filename) {
    try {
        const response = await fetch(`data/${filename}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Update user data
function updateUserData(updates) {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
}

// Calculate overall progress
function calculateProgress(user) {
    const totalMaterials = 5;
    const completedCount = user.completedMaterials?.length || 0;
    return Math.round((completedCount / totalMaterials) * 100);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show notification (simple alert replacement)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1e40af'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUserData();
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add active state to navigation on scroll (for landing page)
    if (document.querySelector('.landing-nav')) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.landing-nav .nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeUserData,
        loadJSON,
        getCurrentUser,
        updateUserData,
        calculateProgress,
        formatDate,
        scrollToElement,
        showNotification
    };
}
