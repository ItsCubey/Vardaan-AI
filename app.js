/**
 * Vardaan AI - Modern JavaScript Application
 * Fixed and optimized for reliable navigation and functionality
 */

class VardaanAI {
    constructor() {
        this.currentSection = 'home';
        this.isTransitioning = false;
        this.animations = new Map();
        
        console.log('ðŸš€ Initializing Vardaan AI...');
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            this.setupEventListeners();
            this.initializeNavigation();
            this.initializeAnimations();
            this.initializeFormHandling();
            this.initializeLegalTabs();
            this.initializeMobileMenu();
            this.initializeScrollEffects();
            
            // Set initial section
            const hash = window.location.hash.substring(1);
            const initialSection = hash && this.isValidSection(hash) ? hash : 'home';
            this.showSection(initialSection);
            
            // Start initial animations
            setTimeout(() => this.startInitialAnimations(), 500);
            
            console.log('âœ… Vardaan AI initialized successfully');
        } catch (error) {
            console.error('âŒ Error initializing:', error);
        }
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-target]');
            if (target) {
                e.preventDefault();
                const sectionId = target.getAttribute('data-target');
                if (sectionId && this.isValidSection(sectionId)) {
                    this.showSection(sectionId);
                    this.closeMobileMenu();
                }
            }
        });

        // Logo clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-logo, .footer-logo')) {
                e.preventDefault();
                this.showSection('home');
                this.closeMobileMenu();
            }
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Window events
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (navMenu?.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    initializeNavigation() {
        // Ensure all sections exist and are properly configured
        this.validateSections();
        this.updateActiveNavLink();
    }

    validateSections() {
        const sections = ['home', 'about', 'features', 'pricing', 'docs', 'blog', 'contact', 'legal'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                // Ensure proper classes
                section.classList.add('page-section');
                
                // Hide all except home initially
                if (sectionId !== 'home') {
                    section.style.display = 'none';
                    section.classList.remove('active');
                } else {
                    section.style.display = 'block';
                    section.classList.add('active');
                }
            } else {
                console.error(`âŒ Section not found: ${sectionId}`);
            }
        });
    }

    showSection(sectionId) {
        if (this.isTransitioning || !this.isValidSection(sectionId)) {
            console.warn('Cannot show section:', sectionId);
            return;
        }

        this.isTransitioning = true;
        const previousSection = this.currentSection;
        this.currentSection = sectionId;

        console.log(`ðŸ”„ Switching from ${previousSection} to ${sectionId}`);

        try {
            // Hide all sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
                section.style.opacity = '0';
            });

            // Show target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Force reflow
                targetSection.offsetHeight;
                
                // Fade in
                requestAnimationFrame(() => {
                    targetSection.classList.add('active');
                    targetSection.style.opacity = '1';
                    
                    // Update navigation
                    this.updateActiveNavLink();
                    
                    // Update URL
                    if (window.location.hash !== `#${sectionId}`) {
                        history.pushState(null, null, `#${sectionId}`);
                    }
                    
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Trigger section-specific animations
                    this.triggerSectionAnimations(sectionId);
                });
            }
        } catch (error) {
            console.error('Error showing section:', error);
        } finally {
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        }
    }

    updateActiveNavLink() {
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            const target = link.getAttribute('data-target');
            if (target === this.currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    isValidSection(sectionId) {
        const validSections = ['home', 'about', 'features', 'pricing', 'docs', 'blog', 'contact', 'legal'];
        return validSections.includes(sectionId) && document.getElementById(sectionId) !== null;
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe animated elements
        const animatedElements = document.querySelectorAll(`
            .stat-card, .showcase-card, .feature-card, .pricing-card,
            .about-card, .team-card, .docs-card, .blog-card, .contact-card,
            .timeline-item
        `);

        animatedElements.forEach((el, index) => {
            el.style.setProperty('--animation-delay', `${index * 100}ms`);
            observer.observe(el);
        });

        // Setup counter animations
        this.setupCounters();
    }

    animateElement(element) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Special handling for stat cards
        if (element.classList.contains('stat-card')) {
            this.animateCounter(element);
        }
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-card[data-count]');
        
        counters.forEach(card => {
            const counter = card.querySelector('.stat-number');
            const target = parseInt(card.getAttribute('data-count'));
            
            const animate = () => this.animateCounterValue(counter, target);
            this.animations.set(card, animate);
        });
    }

    animateCounter(card) {
        const animation = this.animations.get(card);
        if (animation) {
            setTimeout(animation, 300);
        }
    }

    animateCounterValue(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            
            const current = Math.floor(target * eased);
            
            // Format number based on value
            if (target >= 10000000) {
                element.textContent = Math.floor(current / 1000000) + 'M+';
            } else if (target >= 1000) {
                element.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (target === 999 ? '.9%' : '+');
            } else {
                element.textContent = current + (target === 999 ? '.9%' : '+');
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Completion effect
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        };
        
        requestAnimationFrame(animate);
    }

    triggerSectionAnimations(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Reset and trigger animations
        const animatedElements = section.querySelectorAll('.stat-card, .showcase-card, .feature-card');
        
        animatedElements.forEach((el, index) => {
            el.classList.remove('animated');
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                this.animateElement(el);
            }, index * 100);
        });

        // Special case for home section counters
        if (sectionId === 'home') {
            setTimeout(() => {
                document.querySelectorAll('.stat-card[data-count]').forEach(card => {
                    this.animateCounter(card);
                });
            }, 800);
        }
    }

    startInitialAnimations() {
        const homeSection = document.getElementById('home');
        if (homeSection && homeSection.classList.contains('active')) {
            this.triggerSectionAnimations('home');
        }
    }

    initializeFormHandling() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Field validation
        const fields = contactForm.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification(
                `Thank you, ${formData.get('name')}! Your message has been sent successfully.`,
                'success'
            );
            
            form.reset();
            
        } catch (error) {
            this.showNotification(
                'Sorry, there was an error sending your message. Please try again.',
                'error'
            );
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        this.clearFieldError(field);

        if (field.required && !value) {
            this.showFieldError(field, 'This field is required.');
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address.');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<span class="material-icons">error</span>${message}`;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const error = field.parentNode.querySelector('.field-error');
        if (error) error.remove();
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.innerHTML = '<span class="material-icons">hourglass_empty</span>Sending...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = 'Send Message<span class="material-icons">send</span>';
        }
    }

    initializeLegalTabs() {
        const tabs = document.querySelectorAll('.legal-tab');
        const sections = document.querySelectorAll('.legal-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update sections
                sections.forEach(s => s.classList.remove('active'));
                const targetSection = document.getElementById(targetTab);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    initializeMobileMenu() {
        // Mobile menu functionality is handled in setupEventListeners
        // This method can be used for additional mobile-specific setup
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (!navMenu || !navToggle) return;
        
        const isActive = navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            
            const spans = navToggle?.querySelectorAll('span');
            spans?.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
            
            document.body.style.overflow = '';
        }
    }

    initializeScrollEffects() {
        // Navbar scroll effects
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                navbar.classList.toggle('scrolled', currentScrollY > 50);
                
                // Hide/show navbar
                if (currentScrollY > 200) {
                    const scrollingDown = currentScrollY > lastScrollY;
                    navbar.style.transform = scrollingDown && currentScrollY > 300 ? 'translateY(-100%)' : 'translateY(0)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', this.throttle(handleScroll, 16));
        
        // Scroll progress
        this.initializeScrollProgress();
    }

    initializeScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        const updateProgress = () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 16));
    }

    handleScroll() {
        // Additional scroll handling can be added here
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && this.isValidSection(hash) && hash !== this.currentSection) {
            this.showSection(hash);
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeMobileMenu();
        }
        
        // Navigation with Ctrl/Cmd + Arrow keys
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
            const sections = ['home', 'about', 'features', 'pricing', 'docs', 'blog', 'contact', 'legal'];
            const currentIndex = sections.indexOf(this.currentSection);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                this.showSection(sections[currentIndex - 1]);
            } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
                e.preventDefault();
                this.showSection(sections[currentIndex + 1]);
            }
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="material-icons">${icons[type]}</span>
                <span>${message}</span>
                <button class="notification-close">
                    <span class="material-icons">close</span>
                </button>
            </div>
        `;

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            minWidth: '320px',
            maxWidth: '400px',
            background: 'var(--color-surface)',
            border: `2px solid ${type === 'success' ? 'var(--color-accent)' : type === 'error' ? '#ff4444' : 'var(--color-accent)'}`,
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        document.body.appendChild(notification);

        // Show notification
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto hide
        const hideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize application
let app = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    try {
        app = new VardaanAI();
        window.vardaanAI = app;
        
        console.log('ðŸŽ‰ Application ready!');
    } catch (error) {
        console.error('âŒ Failed to initialize application:', error);
    }
}

// Add required CSS for animations and notifications
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .page-section {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .page-section:not(.active) {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .stat-card, .showcase-card, .feature-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .stat-card.animated, .showcase-card.animated, .feature-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .field-error {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        color: #ff4444;
        font-size: var(--font-size-sm);
        margin-top: var(--space-2);
    }
    
    .form-control.error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.1) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: var(--space-1);
        border-radius: var(--radius-sm);
        margin-left: auto;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .scroll-progress {
        width: 0%;
        transition: width 0.1s ease;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            left: 0;
        }
    }
`;

document.head.appendChild(additionalStyles);

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
