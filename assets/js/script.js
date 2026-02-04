/**
 * RONCA STYLE - Main JavaScript
 * Animazioni avanzate, interazioni e effetti
 */

// ============================================
// UTILITIES
// ============================================

const utils = {
    // Debounce function
    debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Lerp (Linear interpolation)
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    // Clamp
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    // Map range
    mapRange(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    // Check if element is in viewport
    isInViewport(el, offset = 0) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= offset
        );
    },

    // Get scroll percentage
    getScrollPercent() {
        const h = document.documentElement;
        const b = document.body;
        return (h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight) * 100;
    }
};

// ============================================
// PRELOADER
// ============================================

class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        // Nascondi subito il preloader
        if (this.preloader) {
            this.preloader.classList.add('hidden');
        }
        document.body.classList.remove('no-scroll');
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================

class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.follower = document.getElementById('cursor-follower');

        if (!this.cursor || !this.follower) return;

        this.cursorPos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.isHovering = false;

        this.init();
    }

    init() {
        // Only on desktop with fine pointer
        if (window.matchMedia('(pointer: fine)').matches) {
            this.bindEvents();
            this.animate();
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursorPos.x = e.clientX;
            this.cursorPos.y = e.clientY;
        });

        // Hover effects on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .category-card, .accessory-card, input');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.follower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.follower.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        });
    }

    animate() {
        // Smooth follower movement
        this.followerPos.x = utils.lerp(this.followerPos.x, this.cursorPos.x, 0.15);
        this.followerPos.y = utils.lerp(this.followerPos.y, this.cursorPos.y, 0.15);

        this.cursor.style.left = `${this.cursorPos.x}px`;
        this.cursor.style.top = `${this.cursorPos.y}px`;

        this.follower.style.left = `${this.followerPos.x}px`;
        this.follower.style.top = `${this.followerPos.y}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// HEADER
// ============================================

class Header {
    constructor() {
        this.header = document.getElementById('header');
        this.menuToggle = document.getElementById('menu-toggle');
        this.mainNav = document.getElementById('main-nav');
        this.secondaryBar = document.querySelector('.top-bar-secondary');
        this.announcementHeight = 36;
        this.secondaryBarHeight = 32;
        this.headerHeight = 60;

        this.lastScrollY = 0;
        this.scrollThreshold = 150;

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Scroll handling
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 10));

        // Menu toggle
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mainNav.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Nav image change on hover
        const navItems = document.querySelectorAll('.nav-item');
        const navImage = document.getElementById('nav-image');
        const imageMap = {
            donna: 'focus_1_donna631x730_16_jpg.webp',
            uomo: 'focus_1_uomo1750x1759_14_jpg.webp',
            accessori: 'accessori_1_1170x1500_23_jpg.webp',
            brand: 'negozio_2_3.jpg',
            saldi: 'donna_homesaldi_1166x970_jpg.webp'
        };

        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const key = item.dataset.nav;
                if (imageMap[key] && navImage) {
                    navImage.style.opacity = '0';
                    setTimeout(() => {
                        navImage.src = imageMap[key];
                        navImage.style.opacity = '1';
                    }, 200);
                }
            });
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > this.announcementHeight) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        // Hide/show secondary bar on scroll
        if (this.secondaryBar) {
            if (currentScrollY > 50) {
                this.secondaryBar.classList.add('hidden');
            } else {
                this.secondaryBar.classList.remove('hidden');
            }
        }

        this.lastScrollY = currentScrollY;
    }

    toggleMenu() {
        const isActive = this.mainNav.classList.contains('active');

        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuToggle.classList.add('active');
        this.mainNav.classList.add('active');
        document.body.classList.add('menu-open');
        this.header.classList.remove('transparent');
    }

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');

        if (window.scrollY < 50) {
            this.header.classList.add('transparent');
        }
    }
}

// ============================================
// SEARCH OVERLAY
// ============================================

class Search {
    constructor() {
        this.overlay = document.getElementById('search-overlay');
        this.toggle = document.getElementById('search-toggle');
        this.close = document.getElementById('search-close');
        this.input = this.overlay?.querySelector('.search-input');

        if (!this.overlay) return;
        this.init();
    }

    init() {
        this.toggle?.addEventListener('click', () => this.open());
        this.close?.addEventListener('click', () => this.hide());

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.hide();
            }
        });

        // Close on click outside
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }

    open() {
        this.overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        setTimeout(() => {
            this.input?.focus();
        }, 300);
    }

    hide() {
        this.overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// ============================================
// ANNOUNCEMENT BAR SLIDER
// ============================================

class AnnouncementSlider {
    constructor() {
        this.container = document.querySelector('.announcement-slider');
        this.slides = document.querySelectorAll('.announcement-slide');
        this.prevBtn = document.querySelector('.announcement-prev');
        this.nextBtn = document.querySelector('.announcement-next');

        if (!this.container || this.slides.length === 0) return;

        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;

        this.init();
    }

    init() {
        this.bindEvents();
        this.startAutoPlay();
    }

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => {
            this.prev();
            this.resetAutoPlay();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.next();
            this.resetAutoPlay();
        });
    }

    goTo(index) {
        if (index === this.currentSlide) return;

        // Remove active from current
        this.slides[this.currentSlide].classList.remove('active');

        // Update index
        this.currentSlide = index;

        // Add active to new
        this.slides[this.currentSlide].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goTo(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goTo(prevIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ============================================
// HERO ANIMATIONS
// ============================================

// ============================================
// NEWS SLIDER
// ============================================

class NewsSlider {
    constructor() {
        this.slider = document.getElementById('news-slider');
        this.slides = this.slider ? this.slider.querySelectorAll('.news-slide') : [];
        this.newsImage = document.getElementById('news-img');

        if (!this.slider || this.slides.length === 0) return;

        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;

        // Immagini per ogni slide
        this.images = [
            'assets/images/blog_1.webp',
            'assets/images/blog_2.webp'
        ];

        this.init();
    }

    init() {
        this.startAutoPlay();
    }

    goTo(index) {
        if (index === this.currentSlide) return;

        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');

        // Cambia immagine
        if (this.newsImage && this.images[index]) {
            this.newsImage.style.opacity = '0';
            setTimeout(() => {
                this.newsImage.src = this.images[index];
                this.newsImage.style.opacity = '1';
            }, 300);
        }
    }

    next() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goTo(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }
}

class HeroAnimations {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.animatedElements = document.querySelectorAll('.hero [data-animate]');

        if (!this.hero) return;

        this.init();
    }

    init() {
        // Start animations after preloader
        setTimeout(() => {
            this.animateIn();
        }, 2300);
    }

    animateIn() {
        this.animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 250);
        });
    }
}

// ============================================
// HERO SLIDER
// ============================================

class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide-bg');

        if (this.slides.length === 0) return;

        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;

        this.init();
    }

    init() {
        this.startAutoPlay();
    }

    goTo(index) {
        if (index === this.currentSlide) return;

        // Remove active from current
        this.slides[this.currentSlide].classList.remove('active');

        // Update index
        this.currentSlide = index;

        // Add active to new
        this.slides[this.currentSlide].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goTo(nextIndex);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll]');
        this.parallaxElements = document.querySelectorAll('[data-parallax]');

        if (this.elements.length === 0) return;

        this.init();
    }

    init() {
        this.observeElements();
        this.handleParallax();
    }

    observeElements() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // observer.unobserve(entry.target); // Uncomment to animate only once
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }

    handleParallax() {
        if (this.parallaxElements.length === 0) return;

        window.addEventListener('scroll', utils.throttle(() => {
            this.parallaxElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const speed = el.dataset.parallaxSpeed || 0.2;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = (rect.top - window.innerHeight) * speed;
                    el.querySelector('img').style.transform = `translateY(${yPos}px) scale(1.1)`;
                }
            });
        }, 16));
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================

class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        if (this.counters.length === 0) return;

        this.init();
    }

    init() {
        const options = {
            root: null,
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
}

// ============================================
// NEWSLETTER FORM
// ============================================

class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.success = document.getElementById('newsletter-success');

        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        // Simulate API call
        const email = this.form.querySelector('input[type="email"]').value;

        // Show loading state
        const submitBtn = this.form.querySelector('.newsletter-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Invio...</span>';
        submitBtn.disabled = true;

        // Simulate delay
        setTimeout(() => {
            // Show success
            this.success.classList.add('active');

            // Reset form
            this.form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Hide success after delay
            setTimeout(() => {
                this.success.classList.remove('active');
            }, 4000);
        }, 1500);
    }
}

// ============================================
// BACK TO TOP
// ============================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', utils.throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerOffset = 110;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .hero-arrow, .back-to-top');
        if (this.buttons.length === 0 || !window.matchMedia('(pointer: fine)').matches) return;

        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ============================================
// IMAGE LAZY LOADING
// ============================================

class LazyLoad {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        if (this.images.length === 0) return;

        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => observer.observe(img));
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    }
}

// ============================================
// TEXT SPLITTING FOR ANIMATIONS
// ============================================

class TextSplit {
    constructor() {
        this.elements = document.querySelectorAll('[data-split]');
        if (this.elements.length === 0) return;

        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            const type = el.dataset.split || 'chars';

            if (type === 'chars') {
                el.innerHTML = text.split('').map((char, i) =>
                    `<span class="char" style="--char-index: ${i}">${char === ' ' ? '&nbsp;' : char}</span>`
                ).join('');
            } else if (type === 'words') {
                el.innerHTML = text.split(' ').map((word, i) =>
                    `<span class="word" style="--word-index: ${i}">${word}</span>`
                ).join(' ');
            }
        });
    }
}

// ============================================
// TILT EFFECT
// ============================================

class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.category-card, .accessory-card');
        if (this.cards.length === 0 || !window.matchMedia('(pointer: fine)').matches) return;

        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// ============================================
// REVEAL ANIMATIONS ON SCROLL
// ============================================

class RevealOnScroll {
    constructor() {
        this.init();
    }

    init() {
        // Stagger animations for grid items
        const grids = document.querySelectorAll('.categories-grid, .accessories-grid');

        grids.forEach(grid => {
            const items = grid.children;

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                    observer.disconnect();
                }
            }, { threshold: 0.2 });

            observer.observe(grid);
        });
    }
}

// ============================================
// PAGE TRANSITIONS
// ============================================

class PageTransitions {
    constructor() {
        this.init();
    }

    init() {
        // Add transition class to all internal links
        document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="tel"]):not([href^="mailto"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;

                // For demo purposes, prevent navigation
                e.preventDefault();

                // Add exit animation
                document.body.classList.add('page-exit');

                // Navigate after animation
                setTimeout(() => {
                    // window.location.href = href;
                    console.log('Would navigate to:', href);
                    document.body.classList.remove('page-exit');
                }, 500);
            });
        });
    }
}

// ============================================
// MARQUEE PAUSE ON HOVER
// ============================================

class MarqueeControl {
    constructor() {
        this.marquee = document.querySelector('.marquee');
        if (!this.marquee) return;

        this.init();
    }

    init() {
        const content = this.marquee.querySelector('.marquee-content');

        this.marquee.addEventListener('mouseenter', () => {
            content.style.animationPlayState = 'paused';
        });

        this.marquee.addEventListener('mouseleave', () => {
            content.style.animationPlayState = 'running';
        });
    }
}

// ============================================
// LOADING STATE FOR IMAGES
// ============================================

class ImageLoadState {
    constructor() {
        this.images = document.querySelectorAll('.hero-image img, .category-image img, .accessory-image img');
        this.init();
    }

    init() {
        this.images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }
}

// ============================================
// CART FUNCTIONALITY (DEMO)
// ============================================

class Cart {
    constructor() {
        this.count = 0;
        this.countEl = document.querySelector('.cart-count');

        this.init();
    }

    init() {
        // Demo: random cart update
        setTimeout(() => {
            this.updateCount(2);
        }, 3000);
    }

    updateCount(count) {
        this.count = count;
        if (this.countEl) {
            this.countEl.textContent = count;
            this.countEl.classList.add('pulse');
            setTimeout(() => {
                this.countEl.classList.remove('pulse');
            }, 300);
        }
    }

    addItem() {
        this.updateCount(this.count + 1);
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

class KeyboardNav {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Focus visible outlines
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// ============================================
// PERFORMANCE MONITOR (DEV)
// ============================================

class PerformanceMonitor {
    constructor() {
        if (location.hostname !== 'localhost') return;
        this.init();
    }

    init() {
        // FPS counter
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                // console.log('FPS:', fps);
            }

            requestAnimationFrame(measureFPS);
        };

        // measureFPS(); // Uncomment to enable
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // Initialize all modules
    new Preloader();
    new CustomCursor();
    new Header();
    new Search();
    new AnnouncementSlider();
    new HeroAnimations();
    new HeroSlider();
    new NewsSlider();
    new ScrollAnimations();
    new CounterAnimation();
    new Newsletter();
    new BackToTop();
    new SmoothScroll();
    new MagneticButtons();
    new LazyLoad();
    new TiltEffect();
    new RevealOnScroll();
    new MarqueeControl();
    new ImageLoadState();
    new Cart();
    new KeyboardNav();
    new PerformanceMonitor();

    // Log initialization
    console.log('%c RONCA STYLE ', 'background: #000; color: #fff; padding: 10px 20px; font-size: 14px;');
    console.log('%c Dal 1862 ', 'color: #8B7355; font-style: italic;');
});

// ============================================
// SERVICE WORKER REGISTRATION (OPTIONAL)
// ============================================

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}
