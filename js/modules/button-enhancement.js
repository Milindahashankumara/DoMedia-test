// Enhanced Button Visibility and Interaction JavaScript

class ButtonEnhancer {
    constructor() {
        this.ctaButton = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.ctaButton = document.querySelector('.cta-button');
        
        if (!this.ctaButton) {
            console.warn('DoMedia: CTA button not found');
            return;
        }

        this.enhanceVisibility();
        this.addInteractiveEffects();
        this.setupAccessibility();
        this.addTouchEnhancements();
        
        this.isInitialized = true;
        console.log('DoMedia: Button enhancements loaded successfully');
    }

    enhanceVisibility() {
        // Add visibility enhancement class
        this.ctaButton.classList.add('enhanced-visibility');
        
        // Ensure button is visible in viewport
        this.checkButtonVisibility();
        
        // Monitor scroll to adjust button prominence
        this.setupScrollMonitoring();
    }

    checkButtonVisibility() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Button is visible, ensure it's prominent
                    this.ctaButton.classList.add('in-viewport');
                } else {
                    // Button is not visible
                    this.ctaButton.classList.remove('in-viewport');
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(this.ctaButton);
    }

    setupScrollMonitoring() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            // Add scrolling class for enhanced visibility during scroll
            this.ctaButton.classList.add('scrolling');
            
            scrollTimeout = setTimeout(() => {
                this.ctaButton.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
    }

    addInteractiveEffects() {
        // Enhanced click effect with ripple
        this.ctaButton.addEventListener('click', (e) => {
            this.createRipple(e);
            this.addFeedbackEffect();
        });

        // Enhanced hover effects
        this.ctaButton.addEventListener('mouseenter', () => {
            this.addHoverEffect();
        });

        this.ctaButton.addEventListener('mouseleave', () => {
            this.removeHoverEffect();
        });

        // Mouse move effect for dynamic interaction
        this.ctaButton.addEventListener('mousemove', (e) => {
            this.addMouseMoveEffect(e);
        });
    }

    createRipple(e) {
        const ripple = document.createElement('span');
        const rect = this.ctaButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: buttonRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#button-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'button-ripple-style';
            style.textContent = `
                @keyframes buttonRipple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .enhanced-visibility.scrolling {
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(255, 255, 255, 0.2) inset !important;
                }
                
                .enhanced-visibility.in-viewport {
                    animation-duration: 2.5s !important;
                }
            `;
            document.head.appendChild(style);
        }

        this.ctaButton.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    addFeedbackEffect() {
        // Brief feedback animation
        this.ctaButton.style.transform = 'scale(0.96)';
        this.ctaButton.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            this.ctaButton.style.transform = '';
            this.ctaButton.style.transition = '';
        }, 100);

        // Haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    addHoverEffect() {
        // Dynamic gradient shift on hover
        this.ctaButton.style.background = 'rgba(255, 255, 255, 0.3)';
        this.ctaButton.style.borderColor = 'rgba(255, 255, 255, 0.6)';
    }

    removeHoverEffect() {
        // Reset to default state
        this.ctaButton.style.background = '';
        this.ctaButton.style.borderColor = '';
    }

    addMouseMoveEffect(e) {
        const rect = this.ctaButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        // Subtle 3D tilt effect
        const tiltX = deltaY * 5;
        const tiltY = deltaX * -5;
        
        this.ctaButton.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        
        // Reset transform when mouse leaves
        this.ctaButton.addEventListener('mouseleave', () => {
            this.ctaButton.style.transform = '';
        }, { once: true });
    }

    setupAccessibility() {
        // Enhanced keyboard navigation
        this.ctaButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.createKeyboardEffect();
                
                setTimeout(() => {
                    this.ctaButton.click();
                }, 150);
            }
        });

        // Focus enhancements
        this.ctaButton.addEventListener('focus', () => {
            this.ctaButton.classList.add('keyboard-focused');
        });

        this.ctaButton.addEventListener('blur', () => {
            this.ctaButton.classList.remove('keyboard-focused');
        });

        // Add ARIA enhancements
        this.ctaButton.setAttribute('role', 'button');
        this.ctaButton.setAttribute('aria-label', 'Get Started - Begin your digital transformation journey');
        
        // Add description for screen readers
        if (!document.querySelector('#cta-description')) {
            const description = document.createElement('div');
            description.id = 'cta-description';
            description.className = 'sr-only';
            description.textContent = 'Click to start exploring our digital solutions and services';
            document.body.appendChild(description);
            
            this.ctaButton.setAttribute('aria-describedby', 'cta-description');
        }
    }

    createKeyboardEffect() {
        // Visual feedback for keyboard interaction
        this.ctaButton.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.3), 0 6px 20px rgba(0, 0, 0, 0.25)';
        this.ctaButton.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            this.ctaButton.style.boxShadow = '';
            this.ctaButton.style.transform = '';
        }, 200);
    }

    addTouchEnhancements() {
        // Enhanced touch interactions
        this.ctaButton.addEventListener('touchstart', (e) => {
            this.ctaButton.classList.add('touch-active');
            
            // Create touch ripple effect
            const touch = e.touches[0];
            const rippleEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            this.createRipple(rippleEvent);
        }, { passive: true });

        this.ctaButton.addEventListener('touchend', () => {
            setTimeout(() => {
                this.ctaButton.classList.remove('touch-active');
            }, 200);
        }, { passive: true });

        // Prevent double-tap zoom on the button
        this.ctaButton.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    }

    // Public method to manually trigger visibility enhancement
    enhanceVisibilityNow() {
        if (!this.isInitialized || !this.ctaButton) return;
        
        this.ctaButton.style.animation = 'none';
        this.ctaButton.style.background = 'rgba(255, 255, 255, 0.35)';
        this.ctaButton.style.borderColor = 'rgba(255, 255, 255, 0.7)';
        this.ctaButton.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3), 0 4px 15px rgba(255, 255, 255, 0.2) inset';
        
        setTimeout(() => {
            this.ctaButton.style.animation = '';
            this.ctaButton.style.background = '';
            this.ctaButton.style.borderColor = '';
            this.ctaButton.style.boxShadow = '';
        }, 2000);
    }

    // Public method to get button visibility state
    getVisibilityState() {
        if (!this.isInitialized) return null;
        
        const rect = this.ctaButton.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        return {
            isVisible,
            isInViewport: this.ctaButton.classList.contains('in-viewport'),
            isScrolling: this.ctaButton.classList.contains('scrolling'),
            isTouchActive: this.ctaButton.classList.contains('touch-active'),
            isKeyboardFocused: this.ctaButton.classList.contains('keyboard-focused')
        };
    }
}

// Initialize button enhancer
const buttonEnhancer = new ButtonEnhancer();

// Make globally available for debugging and manual enhancement
window.buttonEnhancer = buttonEnhancer;