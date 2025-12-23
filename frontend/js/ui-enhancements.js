/**
 * CyberCare - UI/UX Enhancement Utilities
 * Professional interactions, smooth animations, and skeleton loaders
 */

// ======================
// SMOOTH PAGE TRANSITIONS
// ======================

class PageTransition {
    constructor() {
        this.init();
    }

    init() {
        // Add fade-in animation on page load
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            
            requestAnimationFrame(() => {
                document.body.style.opacity = '1';
            });

            // Animate elements on scroll
            this.initScrollAnimations();
        });

        // Smooth transitions between pages
        this.handlePageLinks();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, .section, .stat-card, .material-card').forEach(el => {
            observer.observe(el);
        });
    }

    handlePageLinks() {
        document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's a hash link
                if (href.startsWith('#')) return;
                
                e.preventDefault();
                
                // Fade out
                document.body.style.opacity = '0';
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }
}

// ======================
// SKELETON LOADER
// ======================

class SkeletonLoader {
    static show(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        const skeleton = `
            <div class="skeleton-wrapper">
                <div class="skeleton skeleton-card">
                    <div class="skeleton skeleton-avatar"></div>
                    <div style="flex: 1;">
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text" style="width: 60%;"></div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = skeleton;
    }

    static hide(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        const skeletonWrapper = container.querySelector('.skeleton-wrapper');
        if (skeletonWrapper) {
            skeletonWrapper.style.opacity = '0';
            setTimeout(() => {
                skeletonWrapper.remove();
            }, 300);
        }
    }

    static showMultiple(container, count = 3) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        let skeletons = '';
        for (let i = 0; i < count; i++) {
            skeletons += `
                <div class="skeleton skeleton-card" style="margin-bottom: 1rem;">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            `;
        }
        
        container.innerHTML = `<div class="skeleton-wrapper">${skeletons}</div>`;
    }
}

// ======================
// SMOOTH SCROLL
// ======================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ======================
// LOADING BUTTON STATE
// ======================

class ButtonLoader {
    static show(button, loadingText = 'Memproses...') {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        
        if (!button) return;

        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        
        button.innerHTML = `
            <span class="loading"></span>
            <span>${loadingText}</span>
        `;
    }

    static hide(button) {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }
        
        if (!button) return;

        button.disabled = false;
        button.innerHTML = button.dataset.originalText || 'Submit';
    }
}

// ======================
// TOAST NOTIFICATIONS
// ======================

class Toast {
    static show(message, type = 'info', duration = 3000) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // Icon based on type
        const icons = {
            success: `<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            error: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            warning: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            info: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <svg viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        document.body.appendChild(toast);

        // Add styles if not already present
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .toast-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                }
                
                .toast-icon svg {
                    width: 100%;
                    height: 100%;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }
                
                .toast-success { border-left: 4px solid #059669; color: #059669; }
                .toast-error { border-left: 4px solid #dc2626; color: #dc2626; }
                .toast-warning { border-left: 4px solid #d97706; color: #d97706; }
                .toast-info { border-left: 4px solid #0284c7; color: #0284c7; }
                
                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 500;
                    color: #334155;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                }
                
                .toast-close:hover {
                    opacity: 1;
                }
                
                .toast-close svg {
                    width: 16px;
                    height: 16px;
                    stroke: #64748b;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }
            `;
            document.head.appendChild(style);
        }

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => toast.remove(), 300);
        });

        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    }
}

// ======================
// MICRO-INTERACTIONS
// ======================

class MicroInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.addRippleEffect();
        this.addHoverEffects();
    }

    addRippleEffect() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .card');
            if (!target) return;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            // Add keyframe if not exists
            if (!document.getElementById('ripple-keyframe')) {
                const style = document.createElement('style');
                style.id = 'ripple-keyframe';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    }

    addHoverEffects() {
        // Add hover lift effect to cards
        document.querySelectorAll('.card, .stat-card, .material-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
}

// ======================
// FORM ENHANCEMENTS
// ======================

class FormEnhancement {
    constructor() {
        this.init();
    }

    init() {
        this.addFloatingLabels();
        this.addValidationFeedback();
    }

    addFloatingLabels() {
        document.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    addValidationFeedback() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const inputs = this.querySelectorAll('[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.classList.add('error');
                        isValid = false;
                    } else {
                        input.classList.remove('error');
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    Toast.show('Mohon lengkapi semua field yang wajib diisi', 'error');
                }
            });
        });
    }
}

// ======================
// INITIALIZE
// ======================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUIEnhancements);
} else {
    initializeUIEnhancements();
}

function initializeUIEnhancements() {
    new PageTransition();
    new SmoothScroll();
    new MicroInteractions();
    new FormEnhancement();
}

// Export utilities for global use
window.CyberCareUI = {
    SkeletonLoader,
    ButtonLoader,
    Toast,
    PageTransition,
    SmoothScroll
};
