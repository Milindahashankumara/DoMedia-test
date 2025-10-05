/**
 * Main JavaScript Entry Point
 * Initializes and coordinates all modules
 */

class DOMediaApp {
    constructor() {
        this.modules = {
            navigation: null,
            animations: null,
            responsiveHandler: null
        };
        
        this.state = {
            isInitialized: false,
            isLoaded: false,
            hasError: false
        };
        
        this.config = {
            loadTimeout: 10000, // 10 seconds
            retryAttempts: 3
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing DO Media Website...');
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Set up global event handlers
            this.setupGlobalEvents();
            
            // Mark app as loaded
            this.handleLoadComplete();
            
            console.log('✅ DO Media Website initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize DO Media Website:', error);
            this.handleError(error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve, { once: true });
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        const initPromises = [];

        // Initialize ViewportUtils and Helpers (these are synchronous)
        if (typeof ViewportUtils !== 'undefined') {
            console.log('📏 ViewportUtils ready');
        }
        
        if (typeof Helpers !== 'undefined') {
            console.log('🔧 Helpers ready');
        }

        // Initialize ResponsiveHandler first (other modules may depend on it)
        if (typeof ResponsiveHandler !== 'undefined') {
            initPromises.push(this.initModule('responsiveHandler', ResponsiveHandler));
        }

        // Initialize Navigation
        if (typeof Navigation !== 'undefined') {
            initPromises.push(this.initModule('navigation', Navigation));
        }

        // Initialize Animations last (may depend on other modules)
        if (typeof Animations !== 'undefined') {
            initPromises.push(this.initModule('animations', Animations));
        }

        // Wait for all modules to initialize
        await Promise.all(initPromises);
    }

    /**
     * Initialize individual module
     */
    async initModule(name, module) {
        try {
            console.log(`🔄 Initializing ${name}...`);
            
            if (typeof module.init === 'function') {
                await module.init();
                this.modules[name] = module;
                console.log(`✅ ${name} initialized`);
            } else {
                console.warn(`⚠️ ${name} module has no init method`);
            }
        } catch (error) {
            console.error(`❌ Failed to initialize ${name}:`, error);
            throw error;
        }
    }

    /**
     * Set up global event handlers
     */
    setupGlobalEvents() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle unload
        window.addEventListener('beforeunload', () => {
            this.handleUnload();
        });

        // Handle errors
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason);
        });

        // Handle custom app events
        document.addEventListener('appError', (event) => {
            this.handleError(event.detail);
        });

        // Performance monitoring
        if ('performance' in window) {
            this.setupPerformanceMonitoring();
        }

        console.log('🎯 Global event handlers set up');
    }

    /**
     * Handle load complete
     */
    handleLoadComplete() {
        this.state.isLoaded = true;
        this.state.isInitialized = true;
        
        // Add loaded class to body with slight delay for animations
        setTimeout(() => {
            document.body.classList.add('loaded');
            document.body.style.opacity = '1';
        }, 100);

        // Dispatch loaded event
        Helpers.dispatchEvent('appLoaded', {
            timestamp: Date.now(),
            modules: Object.keys(this.modules)
        });

        // Run post-load optimizations
        this.runPostLoadOptimizations();
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause expensive operations
            this.pauseExpensiveOperations();
        } else {
            // Page is visible - resume operations
            this.resumeExpensiveOperations();
        }
    }

    /**
     * Pause expensive operations
     */
    pauseExpensiveOperations() {
        if (this.modules.animations && typeof this.modules.animations.pauseAnimations === 'function') {
            this.modules.animations.pauseAnimations();
        }
        
        console.log('⏸️ Paused expensive operations');
    }

    /**
     * Resume expensive operations
     */
    resumeExpensiveOperations() {
        if (this.modules.animations && typeof this.modules.animations.resumeAnimations === 'function') {
            this.modules.animations.resumeAnimations();
        }
        
        console.log('▶️ Resumed expensive operations');
    }

    /**
     * Handle application unload
     */
    handleUnload() {
        console.log('🛑 Application unloading...');
        
        // Cleanup modules
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    console.error('Error during module cleanup:', error);
                }
            }
        });
    }

    /**
     * Handle application errors
     */
    handleError(error) {
        console.error('Application error:', error);
        
        this.state.hasError = true;
        
        // Try to show user-friendly error message
        this.showErrorMessage();
        
        // Report error (in production, you might send to analytics)
        this.reportError(error);
    }

    /**
     * Handle global JavaScript errors
     */
    handleGlobalError(error) {
        console.error('Global error:', error);
        this.handleError(error);
    }

    /**
     * Show error message to user
     */
    showErrorMessage() {
        // Create error notification (simple implementation)
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>We're working to fix this issue. Please refresh the page or try again later.</p>
                <button onclick="location.reload()" class="error-retry-btn">Refresh Page</button>
            </div>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }

    /**
     * Report error (placeholder for analytics)
     */
    reportError(error) {
        // In production, you would send this to your analytics service
        const errorReport = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            modules: Object.keys(this.modules)
        };
        
        console.log('Error report:', errorReport);
        
        // Example: Send to analytics service
        // analytics.track('JavaScript Error', errorReport);
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Performance metrics:', {
                        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                        domComplete: Math.round(perfData.domComplete - perfData.fetchStart)
                    });
                }
            }, 0);
        });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize / memory.totalJSHeapSize > 0.9) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000); // Check every 30 seconds
        }
    }

    /**
     * Run post-load optimizations
     */
    runPostLoadOptimizations() {
        // Preload critical assets
        this.preloadCriticalAssets();
        
        // Optimize images
        this.optimizeImages();
        
        // Clean up unused CSS
        this.cleanupUnusedStyles();
        
        console.log('🔧 Post-load optimizations completed');
    }

    /**
     * Preload critical assets
     */
    preloadCriticalAssets() {
        // Preload fonts if not already loaded
        const fontPreloads = [
            'assets/fonts/helvetica-neue.woff2',
            'assets/fonts/helvetica-neue.woff'
        ];
        
        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = font;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * Optimize images
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    /**
     * Clean up unused styles
     */
    cleanupUnusedStyles() {
        // Remove any development-only styles
        const devStyles = document.querySelectorAll('style[data-dev], link[data-dev]');
        devStyles.forEach(style => style.remove());
    }

    /**
     * Get application state
     */
    getState() {
        return {
            ...this.state,
            modules: Object.keys(this.modules),
            viewport: ViewportUtils ? ViewportUtils.getViewportSize() : null,
            performance: performance.now()
        };
    }
}

// Initialize the application
const app = new DOMediaApp();

// Start initialization when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Make app available globally for debugging
window.DOMediaApp = app;

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMediaApp;
}