// Loading Screen Handler
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const desktop = document.querySelector('.desktop');
    
    if (loadingOverlay && desktop) {
        // Fade out loading overlay
        loadingOverlay.classList.add('hidden');
        
        // Show main content
        desktop.classList.add('loaded');
        
        // Remove loading overlay from DOM after animation completes
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.style.display = 'none';
            }
        }, 500);
    }
}

// Wait for all resources to load
function waitForPageLoad() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;
    
    // Wait for window load (all resources including images)
    window.addEventListener('load', function() {
        // Additional small delay to ensure everything is ready
        setTimeout(() => {
            hideLoadingScreen();
        }, 300);
    });
    
    // Fallback: hide after maximum wait time (in case some resources fail)
    setTimeout(() => {
        if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
            hideLoadingScreen();
        }
    }, 5000);
}

// Initialize loading screen handler
waitForPageLoad();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if Anime.js is loaded, wait a bit if needed
    if (typeof anime === 'undefined') {
        console.warn('Anime.js not immediately available, waiting for load...');
        // Wait a bit for CDN to load
        setTimeout(() => {
            if (typeof anime === 'undefined') {
                console.error('Anime.js failed to load. Some animations may not work.');
            }
        }, 100);
    }

    // Get navigation elements
    const homeButtons = document.querySelectorAll('.text-wrapper-2');
    const Pograming_AI_button = document.querySelectorAll('.text-wrapper-3');
    const Malmo_lib_button = document.querySelectorAll('.text-wrapper-4');
    const Kinaesthetics_button = document.querySelectorAll('.text-wrapper-5');
    
    // Function to handle page navigation
    function navigateToPage(page) {
        window.location.href = page;
    }
    
    // Add click event listeners for navigation (support multiple instances)
    homeButtons.forEach(btn => btn.addEventListener('click', () => navigateToPage('index.html')));
    Malmo_lib_button.forEach(btn => btn.addEventListener('click', () => navigateToPage('Malmo_lib.html')));
    Pograming_AI_button.forEach(btn => btn.addEventListener('click', () => navigateToPage('Programing_AI.html')));
    Kinaesthetics_button.forEach(btn => btn.addEventListener('click', () => navigateToPage('Kinaesthetics.html')));
    
    // Clear any active styles to ensure no default black background
    document.querySelectorAll('.text-wrapper-2, .text-wrapper-3, .text-wrapper-4').forEach(button => {
        button.classList.remove('active');
    });
    
    // Add hover effects with Anime.js - Fixed to properly clear background
    document.querySelectorAll('.text-wrapper-2, .text-wrapper-3, .text-wrapper-4, .text-wrapper-5').forEach(button => {
        if (button && !button.classList.contains('active')) {
            let hoverAnimation = null;
            
            // Ensure initial state is transparent
            button.style.backgroundColor = 'transparent';
            
            button.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    // Pause and reset any existing animation
                    if (hoverAnimation) {
                        hoverAnimation.pause();
                        hoverAnimation = null;
                    }
                    // Clear any inline styles that might interfere
                    this.style.backgroundColor = '';
                    
                    hoverAnimation = anime({
                        targets: this,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        duration: 200,
                        easing: 'easeOutQuad'
                    });
                }
            });
            
            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    // Pause and reset any existing animation
                    if (hoverAnimation) {
                        hoverAnimation.pause();
                        hoverAnimation = null;
                    }
                    
                    hoverAnimation = anime({
                        targets: this,
                        backgroundColor: 'transparent',
                        duration: 200,
                        easing: 'easeOutQuad',
                        complete: () => {
                            // Ensure background is cleared after animation
                            this.style.backgroundColor = 'transparent';
                            hoverAnimation = null;
                        }
                    });
                }
            });
        }
    });

    // Initialize animations
    initAnimations();

    // Toggle text menu vs RightMenu.svg on scroll
    const textMenu = document.querySelector('.menu-container') || document.querySelector('.menu');
    const rightMenu = document.querySelector('.right-menu');
    const rightMenuButton = document.querySelector('.right-menu-button');
    const rightMenuDropdown = document.querySelector('.right-menu-dropdown');
    const SCROLL_THRESHOLD = 85; // px from top; adjust as needed

    // Store animation instances for menu transitions
    let textMenuAnimation = null;
    let rightMenuAnimation = null;
    // Track current menu state to prevent unnecessary animations
    let currentMenuState = null; // 'text' or 'right'

    // Populate dropdown with cloned menu-group once
    if (rightMenuDropdown && textMenu) {
        const originalMenuGroup = textMenu.querySelector('.menu-group') || textMenu.querySelector('.overlap-group');
        if (originalMenuGroup) {
            const clone = originalMenuGroup.cloneNode(true);
            rightMenuDropdown.appendChild(clone);
            // Re-bind navigation for cloned items
            rightMenuDropdown.querySelectorAll('.text-wrapper-2').forEach(btn => btn.addEventListener('click', () => navigateToPage('index.html')));
            rightMenuDropdown.querySelectorAll('.text-wrapper-3').forEach(btn => btn.addEventListener('click', () => navigateToPage('Malmo_lib.html')));
            rightMenuDropdown.querySelectorAll('.text-wrapper-4').forEach(btn => btn.addEventListener('click', () => navigateToPage('Programing_AI.html')));
            rightMenuDropdown.querySelectorAll('.text-wrapper-5').forEach(btn => btn.addEventListener('click', () => navigateToPage('Kinaesthetics_button.html')));
            
            // Apply hover effects to cloned menu items
            rightMenuDropdown.querySelectorAll('.text-wrapper-2, .text-wrapper-3, .text-wrapper-4, .text-wrapper-5').forEach(button => {
                if (button && !button.classList.contains('active')) {
                    let hoverAnimation = null;
                    button.style.backgroundColor = 'transparent';
                    
                    button.addEventListener('mouseenter', function() {
                        if (!this.classList.contains('active')) {
                            if (hoverAnimation) {
                                hoverAnimation.pause();
                                hoverAnimation = null;
                            }
                            this.style.backgroundColor = '';
                            
                            hoverAnimation = anime({
                                targets: this,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                duration: 200,
                                easing: 'easeOutQuad'
                            });
                        }
                    });
                    
                    button.addEventListener('mouseleave', function() {
                        if (!this.classList.contains('active')) {
                            if (hoverAnimation) {
                                hoverAnimation.pause();
                                hoverAnimation = null;
                            }
                            
                            hoverAnimation = anime({
                                targets: this,
                                backgroundColor: 'transparent',
                                duration: 200,
                                easing: 'easeOutQuad',
                                complete: () => {
                                    this.style.backgroundColor = 'transparent';
                                    hoverAnimation = null;
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    const setRightMenuOpen = (open) => {
        if (!rightMenu || !rightMenuDropdown || !rightMenuButton) return;

        if (open) {
            // Make it measurable for animation
            rightMenuDropdown.hidden = false;
            rightMenu.classList.add('open');
            rightMenuButton.setAttribute('aria-expanded', 'true');
            
            // Animate dropdown open with Anime.js (with fallback)
            if (typeof anime !== 'undefined') {
                anime({
                    targets: rightMenuDropdown,
                    opacity: [0, 1],
                    translateY: [-10, 0],
                    scale: [0.95, 1],
                    duration: 200,
                    easing: 'cubicBezier(0.22, 1, 0.36, 1)'
                });
            } else {
                // Fallback if Anime.js not loaded
                rightMenuDropdown.style.opacity = '1';
                rightMenuDropdown.style.transform = 'translateY(0) scale(1)';
            }
        } else {
            // Animate dropdown close with Anime.js (with fallback)
            if (typeof anime !== 'undefined') {
                anime({
                    targets: rightMenuDropdown,
                    opacity: [1, 0],
                    translateY: [0, -10],
                    scale: [1, 0.95],
                    duration: 200,
                    easing: 'cubicBezier(0.22, 1, 0.36, 1)',
                    complete: () => {
                        rightMenu.classList.remove('open');
                        rightMenuDropdown.hidden = true;
                        // Update menu state if needed after closing dropdown
                        const y = window.scrollY || document.documentElement.scrollTop;
                        if (y < SCROLL_THRESHOLD) {
                            currentMenuState = null; // Force update on next scroll
                            updateMenus();
                        }
                    }
                });
            } else {
                // Fallback if Anime.js not loaded
                rightMenu.classList.remove('open');
                rightMenuDropdown.hidden = true;
                rightMenuDropdown.style.opacity = '0';
                rightMenuDropdown.style.transform = 'translateY(-10px) scale(0.95)';
            }
            rightMenuButton.setAttribute('aria-expanded', 'false');
        }
    };

    const onOutsideClick = (e) => {
        if (!rightMenu) return;
        if (!rightMenu.contains(e.target)) {
            setRightMenuOpen(false);
            document.removeEventListener('click', onOutsideClick);
        }
    };

    if (rightMenuButton) {
        rightMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = rightMenu.classList.contains('open');
            setRightMenuOpen(!isOpen);
            if (!isOpen) {
                // Close when clicking outside
                setTimeout(() => document.addEventListener('click', onOutsideClick), 0);
            }
        });
    }

    const updateMenus = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const showRightMenu = y >= SCROLL_THRESHOLD;
        
        // Determine desired state
        let desiredState = showRightMenu ? 'right' : 'text';
        
        // If dropdown is open and user scrolls above threshold, keep right menu visible until closed
        if (!showRightMenu && rightMenu.classList.contains('open')) {
            desiredState = 'right';
        }

        // Only animate if state actually changed
        if (textMenu && rightMenu && currentMenuState !== desiredState) {
            if (desiredState === 'right') {
                // Hide text menu, show right menu
                if (typeof anime !== 'undefined') {
                    if (textMenuAnimation) textMenuAnimation.pause();
                    textMenuAnimation = anime({
                        targets: textMenu,
                        opacity: [1, 0],
                        translateX: [0, 6],
                        duration: 250,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            textMenu.style.pointerEvents = 'none';
                        }
                    });

                    if (rightMenuAnimation) rightMenuAnimation.pause();
                    rightMenu.setAttribute('aria-hidden', 'false');
                    rightMenu.style.pointerEvents = 'auto';
                    rightMenu.style.visibility = 'visible';
                    rightMenu.style.pointerEvents = 'auto';
                    rightMenuAnimation = anime({
                        targets: rightMenu,
                        opacity: [0, 1],
                        translateX: [6, 0],
                        duration: 250,
                        easing: 'easeInOutQuad'
                    });
                } else {
                    // Fallback: use CSS classes
                    textMenu.classList.remove('menu-visible');
                    textMenu.classList.add('menu-hidden');
                    textMenu.style.pointerEvents = 'none';
                    rightMenu.classList.remove('menu-hidden');
                    rightMenu.classList.add('menu-visible');
                    rightMenu.setAttribute('aria-hidden', 'false');
                    rightMenu.style.pointerEvents = 'auto';
                }
                
                currentMenuState = 'right';
            } else {
                // Hide right menu, show text menu
                if (typeof anime !== 'undefined') {
                    if (rightMenuAnimation) rightMenuAnimation.pause();
                    rightMenuAnimation = anime({
                        targets: rightMenu,
                        opacity: [1, 0],
                        translateX: [0, 6],
                        duration: 250,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            rightMenu.style.pointerEvents = 'none';
                            rightMenu.style.visibility = 'hidden';
                            rightMenu.setAttribute('aria-hidden', 'true');
                        }
                    });

                    if (textMenuAnimation) textMenuAnimation.pause();
                    textMenu.style.pointerEvents = 'auto';
                    textMenuAnimation = anime({
                        targets: textMenu,
                        opacity: [0, 1],
                        translateX: [6, 0],
                        duration: 250,
                        easing: 'easeInOutQuad'
                    });
                } else {
                    // Fallback: use CSS classes
                    rightMenu.classList.remove('menu-visible');
                    rightMenu.classList.add('menu-hidden');
                    rightMenu.style.pointerEvents = 'none';
                    rightMenu.setAttribute('aria-hidden', 'true');
                    textMenu.classList.remove('menu-hidden');
                    textMenu.classList.add('menu-visible');
                    textMenu.style.pointerEvents = 'auto';
                }
                
                currentMenuState = 'text';
            }
        }
    };

    // Set initial states based on scroll position
    const initialY = window.scrollY || document.documentElement.scrollTop;
    const showRightMenuInitially = initialY >= SCROLL_THRESHOLD;
    
    if (textMenu) {
        if (showRightMenuInitially) {
            textMenu.style.opacity = '0';
            textMenu.style.transform = 'translateX(6px)';
            textMenu.style.pointerEvents = 'none';
        } else {
            textMenu.style.opacity = '1';
            textMenu.style.transform = 'translateX(0)';
            textMenu.style.pointerEvents = 'auto';
        }
    }
    
    if (rightMenu) {
        if (showRightMenuInitially) {
            rightMenu.style.opacity = '1';
            rightMenu.style.transform = 'translateX(0)';
            rightMenu.style.pointerEvents = 'auto';
            rightMenu.style.visibility = 'visible';
            rightMenu.setAttribute('aria-hidden', 'false');
        } else {
            rightMenu.style.opacity = '0';
            rightMenu.style.transform = 'translateX(6px)';
            rightMenu.style.pointerEvents = 'none';
            rightMenu.style.visibility = 'hidden';
            rightMenu.setAttribute('aria-hidden', 'true');
        }
    }
    
    // Initialize current state based on scroll position
    currentMenuState = showRightMenuInitially ? 'right' : 'text';
    
    updateMenus();
    window.addEventListener('scroll', updateMenus, { passive: true });

    // Initialize page load animations with Anime.js
    const title = document.querySelector('.title-wrapper');
    const sidebar = document.querySelector('.left-sidebar');
    const lowersidebar = document.querySelector('.lower-left-sidebar');
    const sidebarBg = document.querySelector('.sidebar-bg');
    const lowertitle = document.querySelector('.lowertitle');
    const detailtitle = document.querySelector('.detailtitle');
    const menuGroup = document.querySelector('.menu-group') || document.querySelector('.overlap-group');
    const leftIcon = document.querySelector('sidebar-icon-mobile');
    const rightIcon = document.querySelector('Right Menu Icon');
    // Title animation
    if (title) {
        anime({
            targets: [title, lowertitle, detailtitle],
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 800,
            delay: anime.stagger(200),
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    if (menuGroup) {
        anime({
            targets: [menuGroup],
            opacity: [0, 1],
            translateY: [-40, 0],
            duration: 800,
            easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
        });
    }
    // Sidebar animation (after title)
        if (sidebar) {
            anime({
                targets: sidebar,
                opacity: [0, 1],
                translateY: [-40, 0],
                duration: 700,
                delay: 700,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)',

                complete: () => {
                    if (lowersidebar) {
                        anime({
                            targets: lowersidebar,
                            opacity: [0, 1],
                            translateY: [-40, 0],
                            duration: 200,
                            easing: 'cubicBezier(0.53, 0.54, 0.71, 0.73)'
                        });
                    }
                }
            });
        }
    }

    if (leftIcon) {
        let hoverLeftIcon = null

        leftIcon.style.transformOrigin = 'center center';

        leftIcon.addEventListener('mouseenter', () => {
            if (hoverLeftIcon) hoverLeftIcon.pause();
            hoverLeftIcon = anime({
                target:leftIcon,
                scale: isEntering ? 1.07 : 1,
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        })
    }
    // Sidebar hover effects with Anime.js
    if (sidebar && sidebarBg) {
        let hoverScaleAnimation = null;

        sidebar.addEventListener('mouseenter', () => {
            if (hoverScaleAnimation) hoverScaleAnimation.pause();
            hoverScaleAnimation = anime({
                targets: sidebarBg,
                scale: 1.07,
                boxShadow: [
                    { value: '0 0px 0px rgba(0,0,0,0)', duration: 0 },
                    { value: '0 10px 32px rgba(0,0,0,0.18)', duration: 300 }
                ],
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        });

        sidebar.addEventListener('mouseleave', () => {
            if (hoverScaleAnimation) hoverScaleAnimation.pause();
            hoverScaleAnimation = anime({
                targets: sidebarBg,
                scale: 1,
                boxShadow: [
                    { value: '0 10px 32px rgba(0,0,0,0.18)', duration: 0 },
                    { value: '0 0px 0px rgba(0,0,0,0)', duration: 300 }
                ],
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        });

        sidebar.addEventListener('focus', () => {
            if (hoverScaleAnimation) hoverScaleAnimation.pause();
            hoverScaleAnimation = anime({
                targets: sidebarBg,
                scale: 1.07,
                boxShadow: [
                    { value: '0 0px 0px rgba(0,0,0,0)', duration: 0 },
                    { value: '0 10px 32px rgba(0,0,0,0.18)', duration: 300 }
                ],
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        });

        sidebar.addEventListener('blur', () => {
            if (hoverScaleAnimation) hoverScaleAnimation.pause();
            hoverScaleAnimation = anime({
                targets: sidebarBg,
                scale: 1,
                boxShadow: [
                    { value: '0 10px 32px rgba(0,0,0,0.18)', duration: 0 },
                    { value: '0 0px 0px rgba(0,0,0,0)', duration: 300 }
                ],
                duration: 300,
                easing: 'cubicBezier(0.21, 0.61, 0.35, 1)'
            });
        });
    }

    // Add scroll-to-top functionality for left-sidebar button
    const leftSidebar = document.querySelector('.left-sidebar');
    if (leftSidebar) {
        leftSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Enhanced animations using Intersection Observer with Anime.js
const initAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInUp = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const scaleIn = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    scale: [0.95, 1],
                    duration: 500,
                    easing: 'easeOutQuad'
                });
                observer.unobserve(entry.target);
            }
        });
    };

    // Create observers
    const fadeObserver = new IntersectionObserver(fadeInUp, observerOptions);
    const scaleObserver = new IntersectionObserver(scaleIn, observerOptions);

    // Observe elements
    document.querySelectorAll('.work-item, .project-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        fadeObserver.observe(element);
    });

    document.querySelectorAll('.skill-category').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        scaleObserver.observe(element);
    });
};

// Add scroll progress indicator
const addScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Use Anime.js for smooth progress bar animation
        if (typeof anime !== 'undefined') {
            anime({
                targets: progressBar,
                width: scrolled + '%',
                duration: 100,
                easing: 'easeOutQuad'
            });
        } else {
            progressBar.style.width = scrolled + '%';
        }
    });
};

// Initialize scroll progress
addScrollProgress();

// Add mobile menu functionality (kept for compatibility if you add a <nav>)
const initMobileMenu = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '☰';
    nav.appendChild(menuButton);

    const navLinks = document.querySelector('.nav-links');
    
    menuButton.addEventListener('click', () => {
        if (navLinks) navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && !navLinks.contains(e.target) && !menuButton.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
};

// Initialize mobile menu if on mobile
if (window.innerWidth <= 480) {
    initMobileMenu();
}
