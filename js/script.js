/* ============================================
   QUICKERS CREATOR NETWORK - Main JavaScript
   ============================================ */

// ============================================
// CINEMATIC PRELOADER - FIXED
// ============================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-progress-bar');
    const counter = document.querySelector('.preloader-counter');
    const message = document.querySelector('.preloader-message');
    const zoomOverlay = document.querySelector('.preloader-zoom');
    const zoomText = document.querySelector('.zoom-text');
    
    const messages = [
        'Connecting creators...',
        'Loading network...',
        'Almost ready...',
        'Preparing your experience...'
    ];
    
    let progress = 0;
    let msgIndex = 0;

    // Glitch effect on counter
    function glitchCounter(value) {
        const str = value.toString().padStart(3, '0');
        const chars = str.split('');
        
        // Random glitch effect
        if (Math.random() > 0.7) {
            const glitchChar = String.fromCharCode(33 + Math.random() * 94);
            const pos = Math.floor(Math.random() * 3);
            chars[pos] = glitchChar;
        }
        
        counter.textContent = chars.join('');
        counter.classList.add('glitch');
        setTimeout(() => counter.classList.remove('glitch'), 150);
    }

    // Update progress
    const interval = setInterval(() => {
        progress += Math.random() * 4 + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            counter.textContent = '100';
            counter.classList.remove('glitch');
            message.textContent = 'Ready! 🚀';
            
            // Trigger cinematic zoom
            setTimeout(() => {
                zoomOverlay.classList.add('active');
                
                // After zoom animation, zoom out
                setTimeout(() => {
                    zoomOverlay.classList.add('zoom-out');
                    
                    // FIX: Remove zoom overlay from DOM completely
                    setTimeout(() => {
                        // Remove the zoom overlay element from DOM
                        if (zoomOverlay) {
                            zoomOverlay.style.display = 'none';
                            zoomOverlay.style.pointerEvents = 'none';
                        }
                        
                        // Hide preloader
                        preloader.classList.add('hidden');
                        document.body.style.overflow = 'visible';
                        initAnimations();
                        
                        // Start hero video
                        const video = document.querySelector('.hero-video');
                        if (video) {
                            video.play().catch(() => {});
                        }
                    }, 800);
                }, 1200);
            }, 300);
            
            return;
        }
        
        progressBar.style.width = progress + '%';
        glitchCounter(Math.floor(progress));
        
        if (progress > msgIndex * 25) {
            msgIndex = Math.min(Math.floor(progress / 25), 3);
            message.textContent = messages[msgIndex] || messages[0];
        }
    }, 150);
})();

// ============================================
// NAVIGATION - FIXED
// ============================================
(function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.navbar-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const menuItems = document.querySelectorAll('.mobile-menu-item');

    // Sticky nav on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // OPEN mobile menu - hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'visible';
        });
    }

    // CLOSE mobile menu - close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'visible';
        });
    }

    // CLOSE mobile menu - menu item click
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'visible';
        });
    });

    // CLOSE mobile menu - escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'visible';
        }
    });

    // CLOSE mobile menu - click outside (on overlay background)
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === this) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'visible';
        }
    });

    // Prevent menu from closing when clicking inside the menu content
    const menuContent = mobileMenu.querySelector('.mobile-menu-content');
    if (menuContent) {
        menuContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
})();

// ============================================
// DARK MODE
// ============================================
(function initTheme() {
    const toggle = document.getElementById('themeToggle');
    
    function getTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
        if (toggle) {
            toggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = getTheme();
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    setTheme(getTheme());
})();

// ============================================
// SCROLL REVEAL
// ============================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.dataset.counter) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounter(element) {
    const target = parseInt(element.dataset.target) || 0;
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = current.toLocaleString() + (element.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
    }
    requestAnimationFrame(update);
}

// ============================================
// PARALLAX
// ============================================
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15;
    const y = (e.clientY / window.innerHeight - 0.5) * 15;
    document.querySelectorAll('.parallax-element').forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 1;
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ============================================
// 3D CARD TILT
// ============================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${y * 10}deg) rotateY(${x * 10}deg) translateZ(20px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// SCROLL PROGRESS
// ============================================
const progress = document.querySelector('.scroll-progress');
if (progress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (scrollTop / docHeight * 100) + '%';
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// HERO VIDEO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.play().catch(() => {
            video.style.opacity = '0';
        });
    }
});

// ============================================
// MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        this.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

console.log('⚡ Quickers Creator Network loaded!');


// ============================================
// PAGE TRANSITION LOADER - FIXED
// ============================================
(function initPageLoader() {
    // Create loader element if it doesn't exist
    function createLoader() {
        let loader = document.querySelector('.page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Quickers...</div>
                <div class="loader-progress">
                    <div class="loader-progress-bar"></div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        return loader;
    }

    const loader = createLoader();

    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        loader.classList.remove('active');
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    });

    // If page is already loaded (cached), hide immediately
    if (document.readyState === 'complete') {
        loader.classList.remove('active');
        loader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }

    // Show loader on internal link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Skip external links, hash links, and javascript: links
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // Check if it's an internal link (same domain)
        const isInternal = link.href && link.href.indexOf(window.location.origin) === 0;
        if (!isInternal) return;
        
        // Don't show loader if it's the same page with different hash
        const currentPath = window.location.pathname;
        const targetPath = new URL(link.href).pathname;
        if (currentPath === targetPath) return;
        
        e.preventDefault();
        
        // Show loader
        loader.classList.remove('hidden');
        loader.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Navigate after delay
        setTimeout(() => {
            window.location.href = link.href;
        }, 600);
    });

    // Handle back/forward navigation
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            loader.classList.remove('active');
            loader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
    });

    console.log('✅ Page Loader initialized');
})();