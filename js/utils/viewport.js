/**
 * Viewport Utilities
 * Handles viewport-related calculations and responsive behavior
 */

const ViewportUtils = {
    /**
     * Get current viewport dimensions
     * @returns {Object} Viewport width and height
     */
    getViewportSize() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },

    /**
     * Get current breakpoint based on viewport width
     * @returns {string} Current breakpoint name
     */
    getCurrentBreakpoint() {
        const width = this.getViewportSize().width;
        
        if (width >= 1400) return 'xl';
        if (width >= 1024) return 'lg';
        if (width >= 768) return 'md';
        if (width >= 480) return 'sm';
        return 'xs';
    },

    /**
     * Check if viewport matches breakpoint
     * @param {string} breakpoint - Breakpoint to check
     * @returns {boolean} True if viewport matches breakpoint
     */
    isBreakpoint(breakpoint) {
        return this.getCurrentBreakpoint() === breakpoint;
    },

    /**
     * Check if viewport is mobile size
     * @returns {boolean} True if mobile viewport
     */
    isMobile() {
        return this.getViewportSize().width <= 768;
    },

    /**
     * Check if viewport is tablet size
     * @returns {boolean} True if tablet viewport
     */
    isTablet() {
        const width = this.getViewportSize().width;
        return width > 768 && width <= 1024;
    },

    /**
     * Check if viewport is desktop size
     * @returns {boolean} True if desktop viewport
     */
    isDesktop() {
        return this.getViewportSize().width > 1024;
    },

    /**
     * Get scroll position
     * @returns {Object} Scroll x and y coordinates
     */
    getScrollPosition() {
        return {
            x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    },

    /**
     * Get element's position relative to viewport
     * @param {Element} element - Target element
     * @returns {Object} Element position data
     */
    getElementPosition(element) {
        if (!element) return null;
        
        const rect = element.getBoundingClientRect();
        const scroll = this.getScrollPosition();
        
        return {
            top: rect.top + scroll.y,
            left: rect.left + scroll.x,
            width: rect.width,
            height: rect.height,
            bottom: rect.top + scroll.y + rect.height,
            right: rect.left + scroll.x + rect.width,
            centerX: rect.left + scroll.x + (rect.width / 2),
            centerY: rect.top + scroll.y + (rect.height / 2)
        };
    },

    /**
     * Check if element is fully visible in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} True if fully visible
     */
    isElementFullyVisible(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const viewport = this.getViewportSize();
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= viewport.height &&
            rect.right <= viewport.width
        );
    },

    /**
     * Get viewport center point
     * @returns {Object} Center coordinates
     */
    getViewportCenter() {
        const viewport = this.getViewportSize();
        return {
            x: viewport.width / 2,
            y: viewport.height / 2
        };
    },

    /**
     * Calculate distance from element to viewport center
     * @param {Element} element - Target element
     * @returns {number} Distance in pixels
     */
    getDistanceFromCenter(element) {
        if (!element) return Infinity;
        
        const elementPos = this.getElementPosition(element);
        const center = this.getViewportCenter();
        
        const deltaX = elementPos.centerX - center.x;
        const deltaY = elementPos.centerY - center.y;
        
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },

    /**
     * Set up viewport change listeners
     * @param {Function} callback - Callback function for changes
     * @param {number} debounceMs - Debounce delay in milliseconds
     * @returns {Function} Cleanup function
     */
    onViewportChange(callback, debounceMs = 250) {
        const debouncedCallback = Helpers.debounce(() => {
            const viewport = this.getViewportSize();
            const breakpoint = this.getCurrentBreakpoint();
            callback({ viewport, breakpoint });
        }, debounceMs);

        window.addEventListener('resize', debouncedCallback);
        window.addEventListener('orientationchange', debouncedCallback);

        // Initial call
        debouncedCallback();

        // Return cleanup function
        return () => {
            window.removeEventListener('resize', debouncedCallback);
            window.removeEventListener('orientationchange', debouncedCallback);
        };
    },

    /**
     * Set up scroll listeners
     * @param {Function} callback - Callback function for scroll events
     * @param {number} throttleMs - Throttle delay in milliseconds
     * @returns {Function} Cleanup function
     */
    onScroll(callback, throttleMs = 16) {
        const throttledCallback = Helpers.throttle(() => {
            const position = this.getScrollPosition();
            const viewport = this.getViewportSize();
            const progress = position.y / (document.body.scrollHeight - viewport.height);
            callback({ position, viewport, progress: Math.min(1, Math.max(0, progress)) });
        }, throttleMs);

        window.addEventListener('scroll', throttledCallback, { passive: true });

        // Return cleanup function
        return () => {
            window.removeEventListener('scroll', throttledCallback);
        };
    },

    /**
     * Lock scroll (useful for modals)
     */
    lockScroll() {
        const scrollY = this.getScrollPosition().y;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.dataset.scrollY = scrollY.toString();
    },

    /**
     * Unlock scroll
     */
    unlockScroll() {
        const scrollY = document.body.dataset.scrollY;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY, 10));
            delete document.body.dataset.scrollY;
        }
    },

    /**
     * Get safe area insets (for devices with notches)
     * @returns {Object} Inset values
     */
    getSafeAreaInsets() {
        const style = getComputedStyle(document.documentElement);
        return {
            top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
            right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
            bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
            left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
        };
    }
};

// Make ViewportUtils available globally
window.ViewportUtils = ViewportUtils;