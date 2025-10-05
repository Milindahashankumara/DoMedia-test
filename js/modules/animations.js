/**
 * Animations Module
 * Handles scroll animations, hover effects, and interactive animations
 */

const Animations = {
    // Configuration
    config: {
        intersectionThreshold: 0.1,
        intersectionRootMargin: '0px 0px -50px 0px',
        animationDuration: 600,
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        staggerDelay: 100
    },

    // State
    state: {
        observers: [],
        animatedElements: new Set(),
        isInitialized: false,
        prefersReducedMotion: false
    },

    /**
     * Initialize animations
     */
    init() {
        if (this.state.isInitialized) return;
        
        this.checkMotionPreferences();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadAnimations();
        this.bindEvents();
        
        this.state.isInitialized = true;
        console.log('Animations initialized');
    },

    /**
     * Check user's motion preferences
     */
    checkMotionPreferences() {
        this.state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.state.prefersReducedMotion) {
            Helpers.addClass(document.body, 'reduce-motion');
            console.log('Reduced motion preference detected');
        }
    },

    /**
     * Set up scroll-triggered animations
     */
    setupScrollAnimations() {
        if (this.state.prefersReducedMotion) return;

        // Elements to animate on scroll
        const animateOnScroll = document.querySelectorAll(`
            .hero-content h1,
            .hero-content p,
            .cta-button,
            .laptop-frame,
            .scroll-animate
        `);

        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: this.config.intersectionThreshold,
            rootMargin: this.config.intersectionRootMargin
        });

        // Observe elements
        animateOnScroll.forEach(element => {
            if (!this.state.animatedElements.has(element)) {
                observer.observe(element);
            }
        });

        this.state.observers.push(observer);
    },

    /**
     * Animate individual element
     * @param {Element} element - Element to animate
     */
    animateElement(element) {
        if (this.state.animatedElements.has(element) || this.state.prefersReducedMotion) {
            return;
        }

        this.state.animatedElements.add(element);
        
        // Add animation class
        Helpers.addClass(element, 'animate-in');
        
        // Trigger custom animation based on element type
        if (element.matches('.hero-content h1')) {
            this.animateHeroHeading(element);
        } else if (element.matches('.laptop-frame')) {
            this.animateLaptopFrame(element);
        } else if (element.matches('.cta-button')) {
            this.animateCTAButton(element);
        } else {
            this.animateGeneric(element);
        }
    },

    /**
     * Animate hero heading
     * @param {Element} element - Heading element
     */
    animateHeroHeading(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = `all ${this.config.animationDuration}ms ${this.config.animationEasing}`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    },

    /**
     * Animate laptop frame
     * @param {Element} element - Laptop frame element
     */
    animateLaptopFrame(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px) scale(0.9)';
        
        setTimeout(() => {
            element.style.transition = `all ${this.config.animationDuration * 1.2}ms ${this.config.animationEasing}`;
            element.style.opacity = '1';
            element.style.transform = 'translateX(0) scale(1)';
            
            // Animate screen content after laptop appears
            setTimeout(() => {
                this.animateScreenContent(element);
            }, this.config.animationDuration * 0.6);
        }, 100);
    },

    /**
     * Animate screen content inside laptop
     * @param {Element} laptopFrame - Laptop frame element
     */
    animateScreenContent(laptopFrame) {
        const screenElements = laptopFrame.querySelectorAll('.screen-content > *');
        
        screenElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = `all ${this.config.animationDuration * 0.8}ms ${this.config.animationEasing}`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * this.config.staggerDelay);
        });
    },

    /**
     * Animate CTA button
     * @param {Element} element - Button element
     */
    animateCTAButton(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = `all ${this.config.animationDuration}ms ${this.config.animationEasing}`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200);
    },

    /**
     * Generic animation
     * @param {Element} element - Element to animate
     */
    animateGeneric(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = `all ${this.config.animationDuration}ms ${this.config.animationEasing}`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    },

    /**
     * Set up hover effects
     */
    setupHoverEffects() {
        if (this.state.prefersReducedMotion) return;

        // Logo hover effect
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', () => this.handleLogoHover(logo));
            logo.addEventListener('mouseleave', () => this.handleLogoLeave(logo));
        }

        // Navigation link hover effects
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => this.handleNavLinkHover(link));
            link.addEventListener('mouseleave', () => this.handleNavLinkLeave(link));
        });

        // CTA button hover effects
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('mouseenter', () => this.handleCTAHover(ctaButton));
            ctaButton.addEventListener('mouseleave', () => this.handleCTALeave(ctaButton));
        }

        // Laptop frame hover effect
        const laptopFrame = document.querySelector('.laptop-frame');
        if (laptopFrame) {
            laptopFrame.addEventListener('mouseenter', () => this.handleLaptopHover(laptopFrame));
            laptopFrame.addEventListener('mouseleave', () => this.handleLaptopLeave(laptopFrame));
        }
    },

    /**
     * Handle logo hover
     * @param {Element} logo - Logo element
     */
    handleLogoHover(logo) {
        const logoIcon = logo.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.style.transform = 'scale(1.05) rotate(5deg)';
        }
    },

    /**
     * Handle logo leave
     * @param {Element} logo - Logo element
     */
    handleLogoLeave(logo) {
        const logoIcon = logo.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    },

    /**
     * Handle nav link hover
     * @param {Element} link - Navigation link
     */
    handleNavLinkHover(link) {
        link.style.transform = 'translateY(-2px)';
    },

    /**
     * Handle nav link leave
     * @param {Element} link - Navigation link
     */
    handleNavLinkLeave(link) {
        link.style.transform = 'translateY(0)';
    },

    /**
     * Handle CTA button hover
     * @param {Element} button - CTA button
     */
    handleCTAHover(button) {
        button.style.transform = 'translateX(5px) scale(1.02)';
        button.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    },

    /**
     * Handle CTA button leave
     * @param {Element} button - CTA button
     */
    handleCTALeave(button) {
        button.style.transform = 'translateX(0) scale(1)';
        button.style.boxShadow = 'none';
    },

    /**
     * Handle laptop hover
     * @param {Element} laptop - Laptop frame
     */
    handleLaptopHover(laptop) {
        laptop.style.transform = 'translateY(-5px) scale(1.02)';
        
        // Add subtle glow to screen
        const screen = laptop.querySelector('.laptop-screen');
        if (screen) {
            screen.style.boxShadow = '0 25px 80px rgba(68, 87, 253, 0.3)';
        }
    },

    /**
     * Handle laptop leave
     * @param {Element} laptop - Laptop frame
     */
    handleLaptopLeave(laptop) {
        laptop.style.transform = 'translateY(0) scale(1)';
        
        const screen = laptop.querySelector('.laptop-screen');
        if (screen) {
            screen.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        }
    },

    /**
     * Set up load animations
     */
    setupLoadAnimations() {
        // Animate elements that should appear immediately on load
        const immediateElements = document.querySelectorAll('.logo, nav ul li');
        
        immediateElements.forEach((element, index) => {
            if (this.state.prefersReducedMotion) {
                element.style.opacity = '1';
                return;
            }
            
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                element.style.transition = `all ${this.config.animationDuration * 0.8}ms ${this.config.animationEasing}`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 50);
        });
    },

    /**
     * Bind events
     */
    bindEvents() {
        // Listen for motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.state.prefersReducedMotion = e.matches;
            this.checkMotionPreferences();
        });

        // Listen for custom events
        document.addEventListener('mobileMenuOpened', () => {
            this.animateMobileMenuItems();
        });
    },

    /**
     * Animate mobile menu items
     */
    animateMobileMenuItems() {
        if (this.state.prefersReducedMotion) return;
        
        const menuItems = document.querySelectorAll('#mainNav.active ul li');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = `all 300ms ease`;
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    },

    /**
     * Create custom animation
     * @param {Element} element - Target element
     * @param {Object} keyframes - Animation keyframes
     * @param {Object} options - Animation options
     */
    createAnimation(element, keyframes, options = {}) {
        if (this.state.prefersReducedMotion) return;
        
        const animation = element.animate(keyframes, {
            duration: options.duration || this.config.animationDuration,
            easing: options.easing || this.config.animationEasing,
            fill: options.fill || 'forwards',
            ...options
        });
        
        return animation;
    },

    /**
     * Pause all animations
     */
    pauseAnimations() {
        document.querySelectorAll('*').forEach(element => {
            const animations = element.getAnimations();
            animations.forEach(animation => animation.pause());
        });
    },

    /**
     * Resume all animations
     */
    resumeAnimations() {
        document.querySelectorAll('*').forEach(element => {
            const animations = element.getAnimations();
            animations.forEach(animation => animation.play());
        });
    },

    /**
     * Destroy animations (cleanup)
     */
    destroy() {
        // Disconnect all observers
        this.state.observers.forEach(observer => {
            observer.disconnect();
        });
        
        this.state.observers = [];
        this.state.animatedElements.clear();
        this.state.isInitialized = false;
        
        console.log('Animations destroyed');
    }
};

// Make Animations available globally
window.Animations = Animations;