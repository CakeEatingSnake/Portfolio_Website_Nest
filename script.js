/* ==========================================================
   script.js — Marvin Rycken Portfolio
   
   Sections:
   1. Loading Screen  (index.html only)
   2. Page Entry Animations
   3. Sidebar
   4. Menu System
   5. Scroll Animations (Intersection Observer)
   6. Utilities
   ========================================================== */


/* ==========================================================
   1. LOADING SCREEN
   ========================================================== */

   function mixColors(p) {
    const c1 = [0, 62, 220];
    const c2 = [10, 10, 10];
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * p);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * p);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * p);
    return `rgb(${r}, ${g}, ${b})`;
}

function createGrid() {
    const container = document.querySelector('#grid-container');
    if (!container) return;

    for (let i = 0; i < 66; i++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.style.backgroundColor = mixColors(Math.random());
        container.appendChild(square);
    }

    function shuffleColors() {
        anime({
            targets: '.square',
            backgroundColor: () => mixColors(Math.random()),
            duration: 140,
            complete: shuffleColors
        });
    }
    shuffleColors();
}

function hideLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    const desktop = document.querySelector('.desktop');
    if (!overlay || !desktop) return;

    overlay.classList.add('hidden');
    desktop.classList.add('loaded');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);
}

function initLoadingScreen() {
    const overlay = document.getElementById('loading-overlay');
    const desktop = document.querySelector('.desktop');

    // Project pages: simple fade in
    if (!overlay) {
        if (desktop) {
            setTimeout(() => { desktop.classList.add('loaded'); }, 150);
        }
        return;
    }

    // Index page: full animation, once per session
    const alreadyPlayed = sessionStorage.getItem('loadingPlayed');
    if (alreadyPlayed) {
        overlay.style.display = 'none';
        if (desktop) desktop.classList.add('loaded');
        return;
    }

    createGrid();
    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLoadingScreen();
            sessionStorage.setItem('loadingPlayed', 'true');
        }, 3000);
    });
}


/* ==========================================================
   2. PAGE ENTRY ANIMATIONS
   ========================================================== */

function initEntryAnimations() {
    const menuGroup = document.querySelector('.overlap-group') || document.querySelector('.menu-group');

    const title       = document.querySelector('.title-wrapper');
    const lowertitle  = document.querySelector('.lowertitle');
    const detailtitle = document.querySelector('.detailtitle');

    const headerImage = document.querySelector('.header-image');
    const headerText  = document.querySelector('.text-container');

    if (menuGroup) {
        anime({
            targets: menuGroup,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 600,
            delay: 300,
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    }

    const heroElements = [title, lowertitle, detailtitle].filter(Boolean);
    if (heroElements.length) {
        anime({
            targets: heroElements,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            delay: anime.stagger(180, { start: 200 }),
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    }

    if (headerImage) {
        anime({
            targets: headerImage,
            opacity: [0, 1],
            duration: 600,
            delay: 200,
            easing: 'easeOutQuad'
        });
    }

    if (headerText) {
        anime({
            targets: headerText,
            opacity: [0, 1],
            duration: 600,
            delay: 400,
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    }
}


/* ==========================================================
   3. SIDEBAR
   - Appears from left after scrolling down SIDEBAR_THRESHOLD px
   - On index.html: scrolls to top
   - On project pages: navigates back to index.html
   ========================================================== */

const SIDEBAR_THRESHOLD = 120; // px scrolled before sidebar appears

function initSidebar() {
    const container = document.querySelector('.leftsidebar-container');
    const sidebar   = document.querySelector('.left-sidebar');
    const sidebarBg = document.querySelector('.sidebar-bg');

    if (!sidebar || !container) return;

    const currentPage = document.body.dataset.page;

    // Click behaviour
    sidebar.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Scroll-triggered appearance
    function updateSidebarVisibility() {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        if (scrolled >= SIDEBAR_THRESHOLD) {
            container.classList.add('sidebar-visible');
        } else {
            container.classList.remove('sidebar-visible');
        }
    }

    // Set correct initial state
    updateSidebarVisibility();
    window.addEventListener('scroll', updateSidebarVisibility, { passive: true });

    // Hover lift on the bg rectangle
    if (sidebarBg) {
        let anim = null;

        const hoverIn = () => {
            if (anim) anim.pause();
            anim = anime({
                targets: sidebarBg,
                translateY: -4,
                boxShadow: '0 10px 32px rgba(0,0,0,0.3)',
                duration: 250,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        };

        const hoverOut = () => {
            if (anim) anim.pause();
            anim = anime({
                targets: sidebarBg,
                translateY: 0,
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                duration: 250,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        };

        sidebar.addEventListener('mouseenter', hoverIn);
        sidebar.addEventListener('mouseleave', hoverOut);
    }
}


/* ==========================================================
   4. MENU SYSTEM
   Text menu always visible. Current page slot becomes Home.
   ========================================================== */

const ALL_NAV_LINKS = {
    'text-wrapper-2': { href: 'Mapping.html',        label: 'Mapping Sweden',           page: 'mapping' },
    'text-wrapper-3': { href: 'Malmo_lib.html',       label: 'Malmö Library Research',   page: 'malmo_lib' },
    'text-wrapper-4': { href: 'Programing_AI.html',   label: 'Programing Assistive AI',  page: 'programing_ai' },
    'text-wrapper-5': { href: 'Kinesthetics.html',    label: 'Kinesthetics Prototyping', page: 'kinesthetics' },
};

const HOME_LINK = { href: 'index.html', label: 'Home' };

function updateMenuForCurrentPage() {
    const currentPage = document.body.dataset.page;
    if (!currentPage || currentPage === 'index') return;

    const projectOrder = [
        { href: 'Mapping.html',       label: 'Mapping Sweden',           page: 'mapping' },
        { href: 'Malmo_lib.html',     label: 'Malmö Library Research',   page: 'malmo_lib' },
        { href: 'Programing_AI.html', label: 'Programing Assistive AI',  page: 'programing_ai' },
        { href: 'Kinesthetics.html',  label: 'Kinesthetics Prototyping', page: 'kinesthetics' },
    ];

    const remaining = projectOrder.filter(p => p.page !== currentPage);
    const slots = [HOME_LINK, ...remaining];
    const wrapperClasses = ['text-wrapper-2', 'text-wrapper-3', 'text-wrapper-4', 'text-wrapper-5'];

    wrapperClasses.forEach((cls, i) => {
        const link = slots[i];
        document.querySelectorAll('.' + cls).forEach(el => {
            el.textContent = link.label;
            el.dataset.href = link.href;
        });
    });
}

function bindNavLinks(container) {
    Object.entries(ALL_NAV_LINKS).forEach(([cls, data]) => {
        container.querySelectorAll('.' + cls).forEach(el => {
            el.addEventListener('click', () => {
                window.location.href = el.dataset.href || data.href;
            });
        });
    });
}

function bindMenuHovers(container) {
    const selectors = Object.keys(ALL_NAV_LINKS).map(c => '.' + c).join(', ');
    container.querySelectorAll(selectors).forEach(btn => {
        let anim = null;
        btn.style.backgroundColor = 'transparent';

        btn.addEventListener('mouseenter', () => {
            if (anim) anim.pause();
            anim = anime({
                targets: btn,
                backgroundColor: 'rgba(255,255,255,0.12)',
                duration: 180,
                easing: 'easeOutQuad'
            });
        });

        btn.addEventListener('mouseleave', () => {
            if (anim) anim.pause();
            anim = anime({
                targets: btn,
                backgroundColor: 'transparent',
                duration: 180,
                easing: 'easeOutQuad',
                complete: () => { btn.style.backgroundColor = 'transparent'; anim = null; }
            });
        });
    });
}

function initMenu() {
    updateMenuForCurrentPage();

    const textMenu = document.querySelector('.menu-container') || document.querySelector('.menu');
    if (textMenu) {
        bindNavLinks(textMenu);
        bindMenuHovers(textMenu);
    }
}


/* ==========================================================
   5. SCROLL ANIMATIONS
   ========================================================== */

function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.project-container, .About-container, .objective-container, .content-container, .outcome-container'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            anime({
                targets: entry.target,
                opacity: [0, 1],
                translateY: [24, 0],
                duration: 560,
                easing: 'easeOutQuad'
            });
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}


/* ==========================================================
   6. UTILITIES
   ========================================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}


/* ==========================================================
   INIT
   ========================================================== */

initLoadingScreen();

document.addEventListener('DOMContentLoaded', () => {
    initEntryAnimations();
    initSidebar();
    initMenu();
    initScrollAnimations();
    initSmoothScroll();
});