/**
 * Utility Helper Functions
 * Provides common utility functions used throughout the application
 */

const Helpers = {
    /**
     * Debounce function to limit the rate of function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute on leading edge
     * @returns {Function} Debounced function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },

    /**
     * Throttle function to limit function execution to once per specified time
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Add class with animation support
     * @param {Element} element - Target element
     * @param {string} className - Class to add
     */
    addClass(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    },

    /**
     * Remove class with animation support
     * @param {Element} element - Target element
     * @param {string} className - Class to remove
     */
    removeClass(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle class on element
     * @param {Element} element - Target element
     * @param {string} className - Class to toggle
     */
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    },

    /**
     * Wait for element to be available in DOM
     * @param {string} selector - CSS selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<Element>} Promise that resolves with element
     */
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },

    /**
     * Smooth scroll to element
     * @param {Element|string} target - Target element or selector
     * @param {number} offset - Offset from top
     * @param {number} duration - Animation duration
     */
    smoothScrollTo(target, offset = 0, duration = 800) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const startPosition = window.pageYOffset;
        const targetPosition = element.offsetTop - offset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @param {number} threshold - Visibility threshold (0-1)
     * @returns {boolean} True if element is visible
     */
    isInViewport(element, threshold = 0.1) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const elementHeight = rect.height;
        const elementWidth = rect.width;
        
        return (
            rect.top >= 0 - (elementHeight * threshold) &&
            rect.left >= 0 - (elementWidth * threshold) &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (elementHeight * threshold) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + (elementWidth * threshold)
        );
    },

    /**
     * Get CSS custom property value
     * @param {string} property - CSS custom property name
     * @param {Element} element - Element to get property from
     * @returns {string} Property value
     */
    getCSSCustomProperty(property, element = document.documentElement) {
        return getComputedStyle(element).getPropertyValue(property).trim();
    },

    /**
     * Set CSS custom property value
     * @param {string} property - CSS custom property name
     * @param {string} value - New value
     * @param {Element} element - Element to set property on
     */
    setCSSCustomProperty(property, value, element = document.documentElement) {
        element.style.setProperty(property, value);
    },

    /**
     * Create and dispatch custom event
     * @param {string} eventName - Event name
     * @param {*} detail - Event detail data
     * @param {Element} target - Target element
     */
    dispatchEvent(eventName, detail = null, target = document) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        target.dispatchEvent(event);
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * Generate unique ID
     * @param {string} prefix - ID prefix
     * @returns {string} Unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    }
};

// Make Helpers available globally
window.Helpers = Helpers;