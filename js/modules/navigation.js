/**
 * Navigation Module
 * Handles navigation functionality including mobile menu and smooth scrolling
 */

const Navigation = {
    // Configuration
    config: {
        mobileBreakpoint: 768,
        smoothScrollDuration: 800,
        smoothScrollOffset: 80
    },

    // DOM elements
    elements: {
        mobileMenuBtn: null,
        mainNav: null,
        navLinks: null,
        header: null
    },

    // State
    state: {
        isMobileMenuOpen: false,
        currentSection: 'home'
    },

    /**
     * Initialize navigation
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.handleInitialState();
        
        console.log('Navigation initialized');
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.elements.mainNav = document.getElementById('mainNav');
        this.elements.navLinks = document.querySelectorAll('nav a[href^="#"]');
        this.elements.header = document.querySelector('header');
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mobile menu toggle
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });

        // Window resize
        window.addEventListener('resize', Helpers.debounce(() => {
            this.handleResize();
        }, 250));

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Click outside to close mobile menu
        document.addEventListener('click', (e) => {
            if (this.state.isMobileMenuOpen && 
                !this.elements.mainNav.contains(e.target) && 
                !this.elements.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Scroll handling for active states
        window.addEventListener('scroll', Helpers.throttle(() => {
            this.handleScroll();
        }, 100));
    },

    /**
     * Handle initial state
     */
    handleInitialState() {
        // Set initial active state
        this.updateActiveNavItem();
        
        // Ensure mobile menu is closed on desktop
        if (!ViewportUtils.isMobile()) {
            this.closeMobileMenu();
        }
    },

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        this.state.isMobileMenuOpen = true;
        
        Helpers.addClass(this.elements.mainNav, 'active');
        Helpers.addClass(this.elements.mobileMenuBtn, 'active');
        
        // Update button text
        this.elements.mobileMenuBtn.textContent = '✕';
        this.elements.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        
        // Focus management
        const firstNavLink = this.elements.mainNav.querySelector('a');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 100);
        }

        // Dispatch event
        Helpers.dispatchEvent('mobileMenuOpened');
        
        console.log('Mobile menu opened');
    },

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        this.state.isMobileMenuOpen = false;
        
        Helpers.removeClass(this.elements.mainNav, 'active');
        Helpers.removeClass(this.elements.mobileMenuBtn, 'active');
        
        // Update button text
        this.elements.mobileMenuBtn.textContent = '☰';
        this.elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        
        // Dispatch event
        Helpers.dispatchEvent('mobileMenuClosed');
        
        console.log('Mobile menu closed');
    },

    /**
     * Handle navigation link click
     * @param {Event} e - Click event
     * @param {Element} link - Clicked link element
     */
    handleNavClick(e, link) {
        e.preventDefault();
        
        const href = link.getAttribute('href');
        const targetId = href.substring(1);
        
        // Handle special cases
        if (targetId === 'get-started') {
            this.handleGetStarted();
            return;
        }
        
        // Find target element
        const targetElement = document.getElementById(targetId) || document.querySelector(`[data-section="${targetId}"]`);
        
        if (targetElement) {
            // Smooth scroll to target
            this.scrollToElement(targetElement);
            
            // Update active state
            this.updateActiveNavItem(targetId);
            
            // Close mobile menu if open
            if (ViewportUtils.isMobile() && this.state.isMobileMenuOpen) {
                setTimeout(() => this.closeMobileMenu(), 300);
            }
        } else {
            console.warn(`Target element not found: ${targetId}`);
        }
    },

    /**
     * Handle get started button click
     */
    handleGetStarted() {
        // Scroll to contact section or show contact form
        const contactSection = document.getElementById('contact') || 
                              document.querySelector('[data-section="contact"]') ||
                              document.querySelector('.hero-section');
        
        if (contactSection) {
            this.scrollToElement(contactSection);
        }
        
        // Dispatch custom event for tracking
        Helpers.dispatchEvent('getStartedClicked');
    },

    /**
     * Smooth scroll to element
     * @param {Element} target - Target element
     */
    scrollToElement(target) {
        if (!target) return;
        
        const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 0;
        const offset = headerHeight + this.config.smoothScrollOffset;
        
        Helpers.smoothScrollTo(target, offset, this.config.smoothScrollDuration);
    },

    /**
     * Update active navigation item
     * @param {string} sectionId - Active section ID
     */
    updateActiveNavItem(sectionId = null) {
        if (!sectionId) {
            // Determine current section from scroll position
            sectionId = this.getCurrentSection();
        }
        
        this.state.currentSection = sectionId;
        
        // Remove active class from all links
        this.elements.navLinks.forEach(link => {
            Helpers.removeClass(link, 'active');
            link.setAttribute('aria-current', 'false');
        });
        
        // Add active class to current link
        const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        if (activeLink) {
            Helpers.addClass(activeLink, 'active');
            activeLink.setAttribute('aria-current', 'page');
        }
    },

    /**
     * Get current section based on scroll position
     * @returns {string} Current section ID
     */
    getCurrentSection() {
        const sections = ['home', 'about', 'services', 'testimonials', 'contact'];
        const scrollPos = window.pageYOffset + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]) || 
                           document.querySelector(`[data-section="${sections[i]}"]`);
            
            if (section && section.offsetTop <= scrollPos) {
                return sections[i];
            }
        }
        
        return 'home';
    },

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on desktop
        if (!ViewportUtils.isMobile() && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update navigation layout if needed
        this.updateNavigationLayout();
    },

    /**
     * Handle scroll events
     */
    handleScroll() {
        this.updateActiveNavItem();
        
        // Add/remove header background based on scroll position
        if (this.elements.header) {
            const scrolled = window.pageYOffset > 50;
            if (scrolled) {
                Helpers.addClass(this.elements.header, 'scrolled');
            } else {
                Helpers.removeClass(this.elements.header, 'scrolled');
            }
        }
    },

    /**
     * Update navigation layout
     */
    updateNavigationLayout() {
        // This method can be extended for more complex layout updates
        console.log('Navigation layout updated for viewport:', ViewportUtils.getCurrentBreakpoint());
    },

    /**
     * Get current navigation state
     * @returns {Object} Current state
     */
    getState() {
        return {
            ...this.state,
            viewport: ViewportUtils.getCurrentBreakpoint(),
            isMobile: ViewportUtils.isMobile()
        };
    },

    /**
     * Destroy navigation (cleanup)
     */
    destroy() {
        // Remove event listeners and clean up
        this.elements.navLinks.forEach(link => {
            link.removeEventListener('click', this.handleNavClick);
        });
        
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.removeEventListener('click', this.toggleMobileMenu);
        }
        
        console.log('Navigation destroyed');
    }
};

// Make Navigation available globally
window.Navigation = Navigation;