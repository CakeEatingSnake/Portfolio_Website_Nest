/* ==========================================================
   script.js — Marvin Rycken Portfolio
   
   Sections:
   1. Loading Screen  (index.html only)
   2. Page Entry Animations
   3. Sidebar
   4. Menu System (text menu → icon menu on scroll)
   5. Scroll Animations (Intersection Observer)
   6. Utilities
   ========================================================== */


/* ==========================================================
   1. LOADING SCREEN
   Only runs if #loading-overlay exists (index.html)
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

    // Continuously shuffle square colors
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
    const currentPage = document.body.dataset.page;

    // --- Project pages: simple fade in, no overlay needed ---
    if (!overlay) {
        if (desktop) {
            // Small delay lets fonts and CSS fully apply before revealing
            setTimeout(() => {
                desktop.classList.add('loaded');
            }, 300);
        }
        return;
    }

    // --- Index page: full loading animation ---
    // Check if the animation has already played this session
    const alreadyPlayed = sessionStorage.getItem('loadingPlayed');

    if (alreadyPlayed) {
        // Skip straight to showing content
        overlay.style.display = 'none';
        if (desktop) desktop.classList.add('loaded');
        return;
    }

    // First visit this session — play the full animation
    createGrid();
    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLoadingScreen();
            // Remember that it played so we skip it next time
            sessionStorage.setItem('loadingPlayed', 'true');
        }, 3000);
    });
}


/* ==========================================================
   2. PAGE ENTRY ANIMATIONS
   Runs on all pages. Animates whatever elements exist.
   ========================================================== */

function initEntryAnimations() {
    const sidebar  = document.querySelector('.left-sidebar');
    const menuGroup = document.querySelector('.overlap-group') || document.querySelector('.menu-group');

    // Index-only elements (gracefully skipped on project pages)
    const title       = document.querySelector('.title-wrapper');
    const lowertitle  = document.querySelector('.lowertitle');
    const detailtitle = document.querySelector('.detailtitle');

    // Project-page header elements (gracefully skipped on index)
    const headerImage = document.querySelector('.header-image');
    const headerText  = document.querySelector('.text-container');

    // Sidebar always animates in
    if (sidebar) {
        anime({
            targets: sidebar,
            opacity: [0, 1],
            translateY: [-40, 0],
            duration: 700,
            delay: 400,
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    }

    // Menu always animates in from top
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

    // Index hero text stagger
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

    // Project page header fade in
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
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)',
            complete: (anim) => {
                anim.animatables.forEach(a => {
                    a.target.style.transform = '';
                });
            }
        });
    }
}


/* ==========================================================
   3. SIDEBAR
   Scroll-to-top on click. Hover scale animation on the bg pill.
   ========================================================== */

function initSidebar() {
    const sidebar   = document.querySelector('.left-sidebar');
    const sidebarBg = document.querySelector('.sidebar-bg');

    if (!sidebar) return;

    // Scroll to top
    sidebar.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hover animation on the blue pill (desktop only)
    if (sidebarBg) {
        let anim = null;

        const hoverIn = () => {
            if (anim) anim.pause();
            anim = anime({
                targets: sidebarBg,
                scale: 1.07,
                boxShadow: '0 10px 32px rgba(0,0,0,0.22)',
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        };

        const hoverOut = () => {
            if (anim) anim.pause();
            anim = anime({
                targets: sidebarBg,
                scale: 1,
                boxShadow: '0 0px 0px rgba(0,0,0,0)',
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        };

        sidebar.addEventListener('mouseenter', hoverIn);
        sidebar.addEventListener('mouseleave', hoverOut);
        sidebar.addEventListener('focus',      hoverIn);
        sidebar.addEventListener('blur',       hoverOut);
    }
}


/* ==========================================================
   4. MENU SYSTEM
   
   How it works:
   - At the top of the page: the floating text menu (.menu / .menu-container)
     is visible.
   - Once scrolled past SCROLL_THRESHOLD px: the text menu fades out and the
     compact icon button (.right-menu) fades in.
   - Clicking the icon button toggles a dropdown that contains a copy of the
     navigation links.
   - Navigation links on both menus are driven by the NAV_LINKS map below —
     edit this map to change where each item goes.
   - Works identically on index.html and all project pages because it only
     reads from the DOM rather than assuming specific page structure.
   ========================================================== */

   const ALL_NAV_LINKS = {
    'text-wrapper-2': { href: 'Mapping.html',       label: 'Mapping Sweden',         page: 'mapping' },
    'text-wrapper-3': { href: 'Malmo_lib.html',      label: 'Malmö Library Research', page: 'malmo_lib' },
    'text-wrapper-4': { href: 'Programing_AI.html',  label: 'Programing Assistive AI',page: 'programing_ai' },
    'text-wrapper-5': { href: 'Kinesthetics.html',   label: 'Kinesthetics Prototyping',page: 'kinesthetics' },
};

const HOME_LINK = { href: 'index.html', label: 'Home' };

const SCROLL_THRESHOLD = 85; // px — when the switch happens

function updateMenuForCurrentPage() {
    const currentPage = document.body.dataset.page;
    if (!currentPage || currentPage === 'index') return;

    // All project links in display order
    const projectOrder = [
        { href: 'Mapping.html',      label: 'Mapping Sweden',          page: 'mapping' },
        { href: 'Malmo_lib.html',    label: 'Malmö Library Research',  page: 'malmo_lib' },
        { href: 'Programing_AI.html',label: 'Programing Assistive AI', page: 'programing_ai' },
        { href: 'Kinesthetics.html', label: 'Kinesthetics Prototyping',page: 'kinesthetics' },
    ];

    // Remove the current page from the list
    const remaining = projectOrder.filter(p => p.page !== currentPage);

    // Build the final slot order: Home first, then the 3 remaining projects
    const slots = [
        { href: 'index.html', label: 'Home' },
        ...remaining
    ];

    // Apply to each wrapper slot in order
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
    // Swap current page's nav item for Home link first,
    // before anything is cloned or bound
    updateMenuForCurrentPage();

    const textMenu        = document.querySelector('.menu-container') || document.querySelector('.menu');
    const rightMenu       = document.querySelector('.right-menu');
    const rightMenuBtn    = document.querySelector('.right-menu-button');
    const rightMenuDropdown = document.querySelector('.right-menu-dropdown');

    // Bind navigation + hovers on the text menu
    if (textMenu) {
        bindNavLinks(textMenu);
        bindMenuHovers(textMenu);
    }

    // Nothing more to do if there's no right-menu in the HTML
    if (!rightMenu || !rightMenuBtn || !rightMenuDropdown) return;

    // --- Populate dropdown by cloning the menu group ---
    if (textMenu) {
        const source = textMenu.querySelector('.overlap-group') || textMenu.querySelector('.menu-group');
        if (source) {
            const clone = source.cloneNode(true);
            rightMenuDropdown.appendChild(clone);
            bindNavLinks(rightMenuDropdown);
            bindMenuHovers(rightMenuDropdown);
        }
    }

    // --- Dropdown open / close ---
    let dropdownOpen = false;
    let dropdownAnim = null;

    function openDropdown() {
        if (dropdownOpen) return;
        dropdownOpen = true;
        rightMenuDropdown.hidden = false;
        rightMenu.classList.add('open');
        rightMenuBtn.setAttribute('aria-expanded', 'true');

        if (dropdownAnim) dropdownAnim.pause();
        dropdownAnim = anime({
            targets: rightMenuDropdown,
            opacity: [0, 1],
            translateY: [-8, 0],
            scale: [0.96, 1],
            duration: 200,
            easing: 'cubicBezier(0.22, 1, 0.36, 1)'
        });
    }

    function closeDropdown(callback) {
        if (!dropdownOpen) { if (callback) callback(); return; }
        dropdownOpen = false;
        rightMenuBtn.setAttribute('aria-expanded', 'false');

        if (dropdownAnim) dropdownAnim.pause();
        dropdownAnim = anime({
            targets: rightMenuDropdown,
            opacity: [1, 0],
            translateY: [0, -8],
            scale: [1, 0.96],
            duration: 180,
            easing: 'cubicBezier(0.22, 1, 0.36, 1)',
            complete: () => {
                rightMenu.classList.remove('open');
                rightMenuDropdown.hidden = true;
                if (callback) callback();
            }
        });
    }

    rightMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownOpen ? closeDropdown() : openDropdown();
    });

    document.addEventListener('click', (e) => {
        if (dropdownOpen && !rightMenu.contains(e.target)) {
            closeDropdown();
        }
    });

    // --- Switch between text menu and icon menu on scroll ---
    let menuState = null; // 'text' or 'icon'
    let textAnim  = null;
    let iconAnim  = null;

    function showTextMenu() {
        if (menuState === 'text') return;
        menuState = 'text';

        // Close dropdown first if open, then hide icon menu
        closeDropdown(() => {
            if (iconAnim) iconAnim.pause();
            iconAnim = anime({
                targets: rightMenu,
                opacity: [1, 0],
                translateX: [0, 6],
                duration: 220,
                easing: 'easeInOutQuad',
                complete: () => {
                    rightMenu.style.pointerEvents = 'none';
                    rightMenu.style.visibility = 'hidden';
                    rightMenu.setAttribute('aria-hidden', 'true');
                }
            });
        });

        if (textMenu) {
            textMenu.style.pointerEvents = 'auto';
            if (textAnim) textAnim.pause();
            textAnim = anime({
                targets: textMenu,
                opacity: [0, 1],
                translateX: [6, 0],
                duration: 220,
                easing: 'easeInOutQuad'
            });
        }
    }

    function showIconMenu() {
        if (menuState === 'icon') return;
        menuState = 'icon';

        if (textMenu) {
            if (textAnim) textAnim.pause();
            textAnim = anime({
                targets: textMenu,
                opacity: [1, 0],
                translateX: [0, 6],
                duration: 220,
                easing: 'easeInOutQuad',
                complete: () => { textMenu.style.pointerEvents = 'none'; }
            });
        }

        rightMenu.style.visibility = 'visible';
        rightMenu.style.pointerEvents = 'auto';
        rightMenu.setAttribute('aria-hidden', 'false');

        if (iconAnim) iconAnim.pause();
        iconAnim = anime({
            targets: rightMenu,
            opacity: [0, 1],
            translateX: [6, 0],
            duration: 220,
            easing: 'easeInOutQuad'
        });
    }

    function updateMenuOnScroll() {
        const scrolled = window.scrollY || document.documentElement.scrollTop;
        scrolled >= SCROLL_THRESHOLD ? showIconMenu() : showTextMenu();
    }

    // Set correct initial state without animating
    const initiallyScrolled = (window.scrollY || document.documentElement.scrollTop) >= SCROLL_THRESHOLD;

    if (initiallyScrolled) {
        menuState = 'icon';
        if (textMenu) { textMenu.style.opacity = '0'; textMenu.style.pointerEvents = 'none'; }
        rightMenu.style.opacity = '1';
        rightMenu.style.visibility = 'visible';
        rightMenu.style.pointerEvents = 'auto';
        rightMenu.setAttribute('aria-hidden', 'false');
    } else {
        menuState = 'text';
        if (textMenu) { textMenu.style.opacity = '1'; textMenu.style.pointerEvents = 'auto'; }
        rightMenu.style.opacity = '0';
        rightMenu.style.visibility = 'hidden';
        rightMenu.style.pointerEvents = 'none';
        rightMenu.setAttribute('aria-hidden', 'true');
    }

    window.addEventListener('scroll', updateMenuOnScroll, { passive: true });
}


/* ==========================================================
   5. SCROLL ANIMATIONS
   Fade-in elements as they enter the viewport.
   Add class "fade-in-on-scroll" to any element you want animated.
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

// Smooth scroll for any anchor links
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
   INIT — runs everything in the right order
   ========================================================== */

// Grid + loading screen can start immediately (before DOM ready)
initLoadingScreen();

document.addEventListener('DOMContentLoaded', () => {
    initEntryAnimations();
    initSidebar();
    initMenu();
    initScrollAnimations();
    initSmoothScroll();
});