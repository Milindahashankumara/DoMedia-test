// Professional Creative Effects Module
class ProfessionalEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.initScrollAnimations();
        this.initCustomCursor();
        this.initParallaxEffects();
        this.initSmoothScrolling();
        this.initTypingEffect();
    }

    // Professional Loading Animation
    createLoadingOverlay() {
        const loadingHTML = `
            <div class="loading-overlay" id="loadingOverlay">
                <div class="spinner"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);

        // Hide loading after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const overlay = document.getElementById('loadingOverlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                    setTimeout(() => overlay.remove(), 500);
                }
            }, 1000);
        });
    }

    // Professional Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        document.addEventListener('DOMContentLoaded', () => {
            const heroTitle = document.querySelector('.hero-content h1');
            const heroText = document.querySelector('.hero-content p');
            const ctaButton = document.querySelector('.cta-button');
            const heroMockup = document.querySelector('.hero-mockup');

            if (heroTitle) {
                heroTitle.classList.add('fade-in');
                observer.observe(heroTitle);
            }

            if (heroText) {
                heroText.classList.add('slide-left');
                setTimeout(() => observer.observe(heroText), 200);
            }

            if (ctaButton) {
                ctaButton.classList.add('slide-left');
                setTimeout(() => observer.observe(ctaButton), 400);
            }

            if (heroMockup) {
                heroMockup.classList.add('slide-right');
                setTimeout(() => observer.observe(heroMockup), 300);
            }
        });
    }

    // Creative Custom Cursor
    initCustomCursor() {
        const cursor = document.createElement('div');
        const cursorOutline = document.createElement('div');
        
        cursor.classList.add('cursor-dot');
        cursorOutline.classList.add('cursor-outline');
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorOutline);

        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        });

        // Smooth cursor outline animation
        const animateCursorOutline = () => {
            outlineX += (cursorX - outlineX) * 0.1;
            outlineY += (cursorY - outlineY) * 0.1;
            
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateCursorOutline);
        };
        animateCursorOutline();

        // Interactive hover effects
        const interactiveElements = document.querySelectorAll('a, button, .cta-button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorOutline.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
            });
        });
    }

    // Professional Parallax Effects
    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-mockup');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Enhanced Smooth Scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Creative Typing Effect for Hero Title
    initTypingEffect() {
        document.addEventListener('DOMContentLoaded', () => {
            const heroTitle = document.querySelector('.hero-content h1');
            if (!heroTitle) return;

            const originalText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            let charIndex = 0;
            const typeWriter = () => {
                if (charIndex < originalText.length) {
                    heroTitle.textContent += originalText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 50);
                }
            };

            // Start typing effect after a delay
            setTimeout(typeWriter, 1500);
        });
    }
}

// Professional Background Particles
class BackgroundParticles {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.opacity = '0.6';
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
}

// Initialize professional effects
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalEffects();
    new BackgroundParticles();
});

export { ProfessionalEffects, BackgroundParticles };