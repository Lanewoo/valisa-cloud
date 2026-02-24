document.addEventListener('DOMContentLoaded', () => {

    // ===== i18n MODULE =====
    const SUPPORTED_LANGS = ['en', 'tr', 'zh', 'es', 'fr', 'de', 'hu'];
    const LANG_FLAGS = { en: '🇬🇧', tr: '🇹🇷', zh: '🇨🇳', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', hu: '🇭🇺' };
    const LANG_CODES = { en: 'EN', tr: 'TR', zh: '中文', es: 'ES', fr: 'FR', de: 'DE', hu: 'HU' };
    let currentTranslations = {};

    async function loadLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = 'en';
        try {
            const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            const resp = await fetch(`${basePath}lang/${lang}.json`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            currentTranslations = await resp.json();
            applyTranslations();
            document.documentElement.lang = lang;
            localStorage.setItem('valisa-lang', lang);
            updateLangToggle(lang);
        } catch (e) {
            console.error(`Failed to load language "${lang}":`, e);
            if (lang !== 'en') loadLanguage('en');
        }
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (currentTranslations[key] !== undefined) {
                el.textContent = currentTranslations[key];
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (currentTranslations[key] !== undefined) {
                el.placeholder = currentTranslations[key];
            }
        });
    }

    function updateLangToggle(lang) {
        const flagEl = document.getElementById('langFlag');
        const codeEl = document.getElementById('langCode');
        if (flagEl) flagEl.textContent = LANG_FLAGS[lang] || '🇬🇧';
        if (codeEl) codeEl.textContent = LANG_CODES[lang] || 'EN';

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    function detectLanguage() {
        const saved = localStorage.getItem('valisa-lang');
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

        const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        const primary = browserLang.split('-')[0];
        if (SUPPORTED_LANGS.includes(primary)) return primary;
        return 'en';
    }

    // Language selector UI
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');

    if (langToggle && langDropdown) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('open');
        });

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = btn.dataset.lang;
                langDropdown.classList.remove('open');
                loadLanguage(lang);
            });
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('open');
        });
    }

    // Load initial language
    const initialLang = detectLanguage();
    if (initialLang !== 'en') {
        loadLanguage(initialLang);
    } else {
        updateLangToggle('en');
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isOpen = navLinks.classList.contains('active');
        mobileToggle.innerHTML = isOpen
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // Fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        const btn = contactForm.querySelector('.btn-submit');
        const originalContent = btn.innerHTML;
        const successText = currentTranslations['contact.form.success'] || 'Message Sent!';
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            ${successText}
        `;
        btn.style.background = '#4caf50';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);

        console.log('Form submission:', data);
    });

    // Counter animation
    const animateCounter = (el, target) => {
        const isNumber = !isNaN(parseInt(target));
        if (!isNumber) return;

        const num = parseInt(target);
        const suffix = target.replace(/[0-9]/g, '');
        let current = 0;
        const increment = Math.max(1, Math.floor(num / 30));
        const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
                current = num;
                clearInterval(timer);
            }
            el.textContent = current + suffix;
        }, 40);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.hero-stat-number');
                statNumbers.forEach(el => {
                    animateCounter(el, el.textContent.trim());
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);
});
