// Enhanced Laptop Image User Experience with Increased Size and Interactions

class LaptopEnhancer {
    constructor() {
        this.laptopContainer = null;
        this.laptopImage = null;
        this.laptopFrame = null;
        this.isInitialized = false;
        this.observerOptions = {
            threshold: 0.3,
            rootMargin: '50px'
        };
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
        this.findElements();
        
        if (!this.laptopContainer && !this.laptopImage) {
            console.warn('DoMedia: Laptop elements not found');
            return;
        }

        this.enhanceLaptopSize();
        this.addInteractiveEffects();
        this.setupVisibilityTracking();
        this.addTouchEnhancements();
        this.setupAccessibility();
        this.addDynamicEffects();
        
        this.isInitialized = true;
        console.log('DoMedia: Laptop enhancement loaded successfully');
    }

    findElements() {
        this.laptopContainer = document.querySelector('.laptop-container');
        this.laptopImage = document.querySelector('.laptop-image');
        this.laptopFrame = document.querySelector('.laptop-frame');
        this.laptopShowcase = document.querySelector('.laptop-showcase');
    }

    enhanceLaptopSize() {
        // Dynamic size adjustment based on viewport
        this.adjustSizeForViewport();
        
        // Monitor window resize for dynamic adjustments
        window.addEventListener('resize', () => {
            this.debounce(() => this.adjustSizeForViewport(), 250);
        });
    }

    adjustSizeForViewport() {
        const viewportWidth = window.innerWidth;
        let maxWidth;
        
        // Calculate optimal size based on viewport
        if (viewportWidth >= 1400) {
            maxWidth = '800px';
        } else if (viewportWidth >= 1200) {
            maxWidth = '750px';
        } else if (viewportWidth >= 992) {
            maxWidth = '650px';
        } else if (viewportWidth >= 768) {
            maxWidth = '580px';
        } else if (viewportWidth >= 576) {
            maxWidth = '520px';
        } else {
            maxWidth = '450px';
        }

        // Apply enhanced sizes
        if (this.laptopImage) {
            this.laptopImage.style.maxWidth = maxWidth;
        }
        
        if (this.laptopFrame) {
            const frameWidth = parseInt(maxWidth) + 50 + 'px';
            this.laptopFrame.style.maxWidth = frameWidth;
        }
        
        if (this.laptopShowcase) {
            const showcaseWidth = parseInt(maxWidth) + 50 + 'px';
            this.laptopShowcase.style.maxWidth = showcaseWidth;
        }
    }

    addInteractiveEffects() {
        if (!this.laptopContainer && !this.laptopImage) return;

        const targetElement = this.laptopContainer || this.laptopImage;

        // Enhanced hover effects
        targetElement.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e);
        });

        targetElement.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e);
        });

        // Mouse move for dynamic 3D effects
        targetElement.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // Click interaction with feedback
        targetElement.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Double-click for fullscreen preview
        targetElement.addEventListener('dblclick', (e) => {
            this.handleDoubleClick(e);
        });
    }

    handleMouseEnter(e) {
        const element = e.currentTarget;
        
        // Enhanced hover transformation
        element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        if (window.innerWidth > 768) {
            element.style.transform = 'perspective(1500px) rotateY(-5deg) rotateX(0deg) translateY(-15px) scale(1.02)';
        }
        
        // Add glow effect
        element.style.filter = 'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 30px rgba(68, 87, 253, 0.3))';
        
        // Trigger screen content animation
        this.animateScreenContent();
    }

    handleMouseLeave(e) {
        const element = e.currentTarget;
        
        // Reset to normal state
        element.style.transform = '';
        element.style.filter = '';
    }

    handleMouseMove(e) {
        if (window.innerWidth <= 768) return; // Disable on mobile

        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        // Dynamic 3D rotation based on mouse position
        const rotateY = -10 + (deltaX * 10);
        const rotateX = 1 + (deltaY * -5);
        const translateY = -15 + (deltaY * -5);
        
        element.style.transform = `perspective(1500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(${translateY}px) scale(1.02)`;
    }

    handleClick(e) {
        const element = e.currentTarget;
        
        // Click feedback animation
        element.style.transition = 'all 0.1s ease';
        element.style.transform = element.style.transform.replace('scale(1.02)', 'scale(1.01)');
        
        setTimeout(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.transform = element.style.transform.replace('scale(1.01)', 'scale(1.02)');
        }, 100);

        // Ripple effect
        this.createRippleEffect(e);
        
        // Haptic feedback for supported devices
        if (navigator.vibrate) {
            navigator.vibrate([30, 10, 30]);
        }
    }

    handleDoubleClick(e) {
        e.preventDefault();
        this.showFullscreenPreview();
    }

    createRippleEffect(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        
        const ripple = document.createElement('div');
        const size = Math.max(rect.width, rect.height) * 0.8;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: laptopRipple 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 10;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#laptop-ripple-style')) {
            const style = document.createElement('style');
            style.id = 'laptop-ripple-style';
            style.textContent = `
                @keyframes laptopRipple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    animateScreenContent() {
        const screenOverlay = document.querySelector('.laptop-screen-overlay');
        if (!screenOverlay) return;
        
        // Create animated content for the screen
        const existingContent = screenOverlay.querySelector('.dynamic-screen-content');
        if (existingContent) return;
        
        const screenContent = document.createElement('div');
        screenContent.className = 'dynamic-screen-content';
        screenContent.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.9);
            font-size: 10px;
            text-align: center;
            animation: screenPulse 2s ease-in-out infinite;
        `;
        
        screenContent.innerHTML = `
            <div style="margin-bottom: 8px;">🚀 DO Media</div>
            <div style="font-size: 8px; opacity: 0.7;">Digital Solutions</div>
        `;
        
        // Add screen pulse animation
        if (!document.querySelector('#screen-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'screen-pulse-style';
            style.textContent = `
                @keyframes screenPulse {
                    0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
        
        screenOverlay.appendChild(screenContent);
        
        // Remove after animation
        setTimeout(() => {
            if (screenContent.parentNode) {
                screenContent.remove();
            }
        }, 4000);
    }

    setupVisibilityTracking() {
        const elements = [this.laptopContainer, this.laptopImage].filter(Boolean);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('laptop-visible');
                    this.triggerEnhancedAnimation(entry.target);
                } else {
                    entry.target.classList.remove('laptop-visible');
                }
            });
        }, this.observerOptions);
        
        elements.forEach(element => observer.observe(element));
    }

    triggerEnhancedAnimation(element) {
        // Enhanced entrance animation
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'laptopLoadIn 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
    }

    addTouchEnhancements() {
        if (!this.laptopContainer && !this.laptopImage) return;
        
        const targetElement = this.laptopContainer || this.laptopImage;
        
        // Touch start
        targetElement.addEventListener('touchstart', (e) => {
            targetElement.style.transition = 'all 0.2s ease';
            targetElement.style.transform = 'perspective(1200px) rotateY(-5deg) rotateX(0deg) scale(0.98)';
        }, { passive: true });
        
        // Touch end
        targetElement.addEventListener('touchend', () => {
            setTimeout(() => {
                targetElement.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                targetElement.style.transform = '';
            }, 100);
        }, { passive: true });
    }

    setupAccessibility() {
        if (!this.laptopImage) return;
        
        // Enhanced alt text
        this.laptopImage.setAttribute('alt', 'Interactive laptop mockup showcasing DO Media digital solutions - Click to explore');
        
        // Add ARIA attributes
        this.laptopImage.setAttribute('role', 'img');
        this.laptopImage.setAttribute('tabindex', '0');
        this.laptopImage.setAttribute('aria-label', 'DO Media laptop showcase - Interactive preview of our digital platform');
        
        // Keyboard interaction
        this.laptopImage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleClick(e);
            }
        });
        
        // Focus enhancement
        this.laptopImage.addEventListener('focus', () => {
            this.laptopImage.style.outline = '3px solid rgba(255, 255, 255, 0.6)';
            this.laptopImage.style.outlineOffset = '8px';
        });
        
        this.laptopImage.addEventListener('blur', () => {
            this.laptopImage.style.outline = '';
            this.laptopImage.style.outlineOffset = '';
        });
    }

    addDynamicEffects() {
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            if (!this.laptopContainer) return;
            
            const scrollY = window.pageYOffset;
            const rate = scrollY * -0.1;
            
            this.laptopContainer.style.transform = `perspective(1500px) rotateY(-10deg) rotateX(1deg) translateY(${rate}px)`;
        }, { passive: true });
        
        // Auto-enhancement timer
        setInterval(() => {
            this.performPeriodicEnhancement();
        }, 10000); // Every 10 seconds
    }

    performPeriodicEnhancement() {
        if (!this.isElementInViewport(this.laptopContainer || this.laptopImage)) return;
        
        const element = this.laptopContainer || this.laptopImage;
        
        // Subtle attention animation
        element.style.animation = 'laptopAttention 2s ease-in-out';
        
        if (!document.querySelector('#laptop-attention-style')) {
            const style = document.createElement('style');
            style.id = 'laptop-attention-style';
            style.textContent = `
                @keyframes laptopAttention {
                    0%, 100% { transform: perspective(1500px) rotateY(-10deg) rotateX(1deg); }
                    50% { transform: perspective(1500px) rotateY(-8deg) rotateX(0deg) translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            element.style.animation = '';
        }, 2000);
    }

    showFullscreenPreview() {
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'laptop-fullscreen-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create enlarged image
        const enlargedImage = this.laptopImage.cloneNode(true);
        enlargedImage.style.cssText = `
            max-width: 90vw;
            max-height: 90vh;
            width: auto;
            height: auto;
            filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.8));
            animation: zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            color: white;
            font-size: 40px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        `;
        
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
            closeButton.style.transform = 'scale(1.1)';
        });
        
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
            closeButton.style.transform = 'scale(1)';
        });
        
        // Add animations CSS
        if (!document.querySelector('#fullscreen-animations')) {
            const style = document.createElement('style');
            style.id = 'fullscreen-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close handlers
        const closeFullscreen = () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        };
        
        overlay.addEventListener('click', closeFullscreen);
        closeButton.addEventListener('click', closeFullscreen);
        
        // ESC key to close
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeFullscreen();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        overlay.appendChild(enlargedImage);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);
    }

    // Utility functions
    isElementInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public methods for manual control
    enhanceSizeNow() {
        this.adjustSizeForViewport();
        console.log('DoMedia: Laptop size enhanced manually');
    }

    triggerAttentionEffect() {
        this.performPeriodicEnhancement();
    }

    getEnhancementState() {
        return {
            isInitialized: this.isInitialized,
            hasLaptopContainer: !!this.laptopContainer,
            hasLaptopImage: !!this.laptopImage,
            currentImageSize: this.laptopImage ? this.laptopImage.style.maxWidth : null,
            isVisible: this.isElementInViewport(this.laptopContainer || this.laptopImage)
        };
    }
}

// Initialize laptop enhancer
const laptopEnhancer = new LaptopEnhancer();

// Make globally available for debugging and manual enhancement
window.laptopEnhancer = laptopEnhancer;