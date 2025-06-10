const API_NAME = 'hsmain';

// Check for reduced motion preference
const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation timing (in seconds)
const timing = {
    announce: 0,
    nav: 0.1,
    navLogo: 0.3,
    navList: 0.35,
    navMenu: 0.35,
    navButton: 0.5,
    tag: 0.1,
    heading: 0.15,
    subheading: 0.25,
    button: 0.35,
    image: 0.5,
    appear: 0.6
};

// Hero Animations Module
let heroTimeline = null;
let headingSplits = [];
let subheadingSplits = [];
let heroTimeout = null; // Track the setTimeout

const config = {
    global: {
        animationDelay: 0.2
    },
    headingSplit: {
        duration: 1.5,
        stagger: 0.1,
        yPercent: 110,
        ease: "power4.out"
    },
    subheadingSplit: {
        duration: 1.5,
        stagger: 0.1,
        yPercent: 110,
        ease: "power4.out"
    },
    appear: {
        y: 50,
        duration: 1.5,
        ease: "power3.out"
    },
    navStagger: {
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.out"
    },
    nav: {
        duration: 1,
        ease: "power3.out"
    }
};

function updateConfig(newConfig) {
    function deepMerge(target, source) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = target[key] || {};
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
    
    deepMerge(config, newConfig);
}

function killHeroAnimations() {
    if (heroTimeout) {
        clearTimeout(heroTimeout);
        heroTimeout = null;
    }
    
    if (heroTimeline) {
        heroTimeline.kill();
        heroTimeline = null;
    }
    
    headingSplits.forEach(split => {
        if (split && split.revert) {
            split.revert();
        }
    });
    headingSplits = [];
    
    subheadingSplits.forEach(split => {
        if (split && split.revert) {
            split.revert();
        }
    });
    subheadingSplits = [];
    
    // Restore page-wide tabbing if animation is killed
    const allFocusableElements = document.querySelectorAll('[data-original-tabindex]');
    allFocusableElements.forEach(el => {
        el.style.pointerEvents = '';
        const originalTabindex = el.getAttribute('data-original-tabindex');
        if (originalTabindex === '0') {
            el.removeAttribute('tabindex');
        } else {
            el.setAttribute('tabindex', originalTabindex);
        }
        el.removeAttribute('data-original-tabindex');
    });
    // Restore nav pointer events if animation is killed
    const navElement = document.querySelector('[data-hs-hero="nav"]');
    if (navElement) {
        navElement.style.pointerEvents = '';
    }
}

function startHeroAnimations() {
    killHeroAnimations();
    init();
}

function showHeroElementsWithoutAnimation() {
    // Simply show all hero elements without any animation or split text
    const allHeroElements = [
        ...document.querySelectorAll('[data-hs-hero="announce"]'),
        ...document.querySelectorAll('[data-hs-hero="nav"]'),
        ...document.querySelectorAll('[data-hs-hero="nav-menu"]'),
        ...document.querySelectorAll('[data-hs-hero="nav-logo"]'),
        ...document.querySelectorAll('[data-hs-hero="nav-button"] > *:first-child'),
        ...document.querySelectorAll('[data-hs-hero="nav-list"] > * > *:first-child'),
        ...document.querySelectorAll('[data-hs-hero="heading"] > *:first-child'),
        ...document.querySelectorAll('[data-hs-hero="subheading"] > *:first-child'),
        ...document.querySelectorAll('[data-hs-hero="tag"] > *:first-child'),
        ...document.querySelectorAll('[data-hs-hero="button"] > *'),
        ...document.querySelectorAll('[data-hs-hero="image"]'),
        ...document.querySelectorAll('[data-hs-hero="appear"]')
    ];
    
    allHeroElements.forEach(element => {
        if (element) {
            gsap.set(element, { 
                autoAlpha: 1, 
                opacity: 1, 
                y: 0, 
                yPercent: 0 
            });
            // Remove any pointer-events restrictions
            element.style.pointerEvents = '';
        }
    });

    // Restore page-wide tabbing
    const allFocusableElements = document.querySelectorAll('[data-original-tabindex]');
    allFocusableElements.forEach(el => {
        el.style.pointerEvents = '';
        const originalTabindex = el.getAttribute('data-original-tabindex');
        if (originalTabindex === '0') {
            el.removeAttribute('tabindex');
        } else {
            el.setAttribute('tabindex', originalTabindex);
        }
        el.removeAttribute('data-original-tabindex');
    });
}

export async function init() {
    if (typeof window.gsap === "undefined") {
        console.error('GSAP not found - hero animations disabled');
        return;
    }
    
    if (prefersReducedMotion()) {
        // For reduced motion, just show elements without animation
        showHeroElementsWithoutAnimation();
        
        // Still expose the API for consistency
        window[API_NAME] = window[API_NAME] || {};
        window[API_NAME].heroAnimations = {
            config: config,
            updateConfig: updateConfig,
            start: startHeroAnimations,
            kill: killHeroAnimations,
            restart: () => {
                killHeroAnimations();
                startHeroAnimations();
            }
        };
        
        return { result: 'anim-hero initialized (reduced motion)' };
    }
    
    gsap.registerPlugin(ScrollTrigger, SplitText);
    
    // Element selection
    const announceElements = document.querySelectorAll('[data-hs-hero="announce"]');
    const navElement = document.querySelector('[data-hs-hero="nav"]');
    const navMenuElements = document.querySelectorAll('[data-hs-hero="nav-menu"]');
    const navLogoElements = document.querySelectorAll('[data-hs-hero="nav-logo"]');
    const imageElements = document.querySelectorAll('[data-hs-hero="image"]');
    const appearElements = document.querySelectorAll('[data-hs-hero="appear"]');
    
    // Check if nav has advanced config
    const hasAdvancedNav = navElement && navElement.hasAttribute('data-hs-heroconfig') && navElement.getAttribute('data-hs-heroconfig') === 'advanced';
    
    // First child elements - only select if advanced nav is enabled
    const navButton = [];
    if (hasAdvancedNav) {
        const navButtonParents = document.querySelectorAll('[data-hs-hero="nav-button"]');
        navButtonParents.forEach(el => {
            if (el.firstElementChild) navButton.push(el.firstElementChild);
        });
    }
    
    const subheading = [];
    const subheadingAppearElements = [];
    const subheadingElements = document.querySelectorAll('[data-hs-hero="subheading"]');
    const subheadingSplitElements = [];
    
    subheadingElements.forEach(el => {
        if (el.firstElementChild) {
            // Get the heroconfig attribute to determine animation type (default to appear)
            const heroConfig = el.getAttribute('data-hs-heroconfig') || 'appear';
            
            if (heroConfig === 'appear') {
                subheadingAppearElements.push(el.firstElementChild);
            } else {
                subheading.push(el.firstElementChild);
                subheadingSplitElements.push(el);
            }
        }
    });
    
    const heading = [];
    const headingAppearElements = [];
    const headingElements = document.querySelectorAll('[data-hs-hero="heading"]');
    const headingSplitElements = [];
    
    headingElements.forEach(el => {
        if (el.firstElementChild) {
            // Get the heroconfig attribute to determine animation type
            const heroConfig = el.getAttribute('data-hs-heroconfig') || 'word'; // default to word if not specified
            
            if (heroConfig === 'appear') {
                headingAppearElements.push(el.firstElementChild);
            } else {
                heading.push(el.firstElementChild);
                headingSplitElements.push(el);
            }
        }
    });
    
    const tag = [];
    const tagParents = document.querySelectorAll('[data-hs-hero="tag"]');
    tagParents.forEach(el => {
        if (el.firstElementChild) tag.push(el.firstElementChild);
    });
    
    // All children elements
    const buttonAllChildren = [];
    const buttonParents = document.querySelectorAll('[data-hs-hero="button"]');
    buttonParents.forEach(el => {
        const children = Array.from(el.children);
        buttonAllChildren.push(...children);
    });
    
    const navListAllChildren = [];
    if (hasAdvancedNav) {
        const navListParents = document.querySelectorAll('[data-hs-hero="nav-list"]');
        navListParents.forEach(el => {
            const children = Array.from(el.children);
            
            // Add overflow clip class to each child and collect their first child for animation
            children.forEach(child => {
                child.classList.add('u-overflow-clip');
                if (child.firstElementChild) {
                    navListAllChildren.push(child.firstElementChild);
                }
            });
        });
    }
    
    // Initial states
        if (announceElements.length > 0) gsap.set(announceElements, { opacity: 0, y: -50 });
        if (navElement) {
            gsap.set(navElement, { opacity: 0, y: -50 });
            // Disable nav pointer events until animation completes
            navElement.style.pointerEvents = 'none';
        }
        if (hasAdvancedNav && navListAllChildren.length > 0) gsap.set(navListAllChildren, { opacity: 0, yPercent: 110 });
        if (hasAdvancedNav && navMenuElements.length > 0) gsap.set(navMenuElements, { opacity: 0 });
        if (hasAdvancedNav && navButton.length > 0) gsap.set(navButton, { opacity: 0 });
        if (hasAdvancedNav && navLogoElements.length > 0) gsap.set(navLogoElements, { opacity: 0 });
        if (subheadingAppearElements.length > 0) gsap.set(subheadingAppearElements, { y: config.appear.y, opacity: 0 });
        if (tag.length > 0) gsap.set(tag, { y: config.appear.y, opacity: 0 });
        if (buttonAllChildren.length > 0) gsap.set(buttonAllChildren, { y: config.appear.y, opacity: 0 });
        if (imageElements.length > 0) gsap.set(imageElements, { opacity: 0 });
        if (appearElements.length > 0) gsap.set(appearElements, { y: config.appear.y, opacity: 0 });
        if (headingAppearElements.length > 0) gsap.set(headingAppearElements, { y: config.appear.y, opacity: 0 });
        
        // Disable page-wide tabbing and interactions until animation completes
        const allFocusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        allFocusableElements.forEach(el => {
            el.style.pointerEvents = 'none';
            el.setAttribute('data-original-tabindex', el.getAttribute('tabindex') || '0');
            el.setAttribute('tabindex', '-1');
        });
        
        // Animation timeline
        document.fonts.ready.then(() => {
        
        // Split text setup (after fonts are loaded)
        headingSplits = [];
        
        if (heading.length > 0) {
            headingSplitElements.forEach((parent, index) => {
                const textElement = heading[index];
                const splitType = parent.getAttribute('data-hs-heroconfig') || 'word';
                
                let splitConfig = {};
                let elementsClass = '';
                
                if (splitType === 'char') {
                    splitConfig = {
                        type: "words,chars",
                        mask: "chars",
                        charsClass: "char"
                    };
                    elementsClass = 'chars';
                } else if (splitType === 'line') {
                    splitConfig = {
                        type: "lines",
                        mask: "lines",
                        linesClass: "line"
                    };
                    elementsClass = 'lines';
                } else {
                    splitConfig = {
                        type: "words",
                        mask: "words",
                        wordsClass: "word"
                    };
                    elementsClass = 'words';
                }
                
                const split = new SplitText(textElement, splitConfig);
                split.elementsClass = elementsClass;
                headingSplits.push(split);
                
                gsap.set(split[elementsClass], { yPercent: config.headingSplit.yPercent });
                gsap.set(textElement, { autoAlpha: 1 });
            });
        }
        
        // Split text setup for subheadings
        if (subheading.length > 0) {
            subheadingSplitElements.forEach((parent, index) => {
                const textElement = subheading[index];
                const splitType = parent.getAttribute('data-hs-heroconfig') || 'word';
                
                let splitConfig = {};
                let elementsClass = '';
                
                if (splitType === 'char') {
                    splitConfig = {
                        type: "words,chars",
                        mask: "chars",
                        charsClass: "char"
                    };
                    elementsClass = 'chars';
                } else if (splitType === 'line') {
                    splitConfig = {
                        type: "lines",
                        mask: "lines",
                        linesClass: "line"
                    };
                    elementsClass = 'lines';
                } else {
                    splitConfig = {
                        type: "words",
                        mask: "words",
                        wordsClass: "word"
                    };
                    elementsClass = 'words';
                }
                
                const split = new SplitText(textElement, splitConfig);
                split.elementsClass = elementsClass;
                subheadingSplits.push(split);
                
                gsap.set(split[elementsClass], { yPercent: config.subheadingSplit.yPercent });
                gsap.set(textElement, { autoAlpha: 1 });
            });
        }
        
        heroTimeout = setTimeout(() => {
            heroTimeline = gsap.timeline();
            
            if (announceElements.length > 0) {
                heroTimeline.to(announceElements, 
                    { opacity: 1, y: 0, duration: config.nav.duration, ease: config.nav.ease }, 
                    timing.announce
                );
            }
            
            if (navElement) {
                heroTimeline.to(navElement, 
                    { opacity: 1, y: 0, duration: config.nav.duration, ease: config.nav.ease }, 
                    timing.nav
                );
            }
            
            if (hasAdvancedNav && navLogoElements.length > 0) {
                heroTimeline.to(navLogoElements, 
                    { opacity: 1, duration: .5, ease: config.nav.ease }, 
                    timing.navLogo
                );
            }
            
            if (hasAdvancedNav && navListAllChildren.length > 0) {
                heroTimeline.to(navListAllChildren, 
                    { 
                        opacity: 1, 
                        yPercent: 0, 
                        duration: config.nav.duration, 
                        stagger: 0.05, 
                        ease: config.nav.ease,
                        onComplete: () => {
                            // Remove u-overflow-clip class from list children
                            const navListParents = document.querySelectorAll('[data-hs-hero="nav-list"]');
                            navListParents.forEach(parent => {
                                const children = parent.children;
                                Array.from(children).forEach(child => {
                                    child.classList.remove('u-overflow-clip');
                                });
                            });
                        }
                    }, 
                    timing.navList
                );
            }
            
            if (hasAdvancedNav && navMenuElements.length > 0) {
                heroTimeline.to(navMenuElements, 
                    { opacity: 1, duration: config.nav.duration, ease: config.nav.ease }, 
                    timing.navMenu
                );
            }
            
            if (hasAdvancedNav && navButton.length > 0) {
                heroTimeline.to(navButton, 
                    { opacity: 1, duration: config.nav.duration, ease: config.nav.ease }, 
                    timing.navButton
                );
            }
            
            if (headingSplits.length > 0) {
                headingSplits.forEach(split => {
                    heroTimeline.to(split[split.elementsClass], 
                        { 
                            yPercent: 0, 
                            duration: config.headingSplit.duration, 
                            stagger: config.headingSplit.stagger, 
                            ease: config.headingSplit.ease,
                            onComplete: () => {
                                if (split && split.revert) {
                                    
                                }
                            }
                        }, 
                        timing.heading
                    );
                });
            }
            
            if (subheadingSplits.length > 0) {
                subheadingSplits.forEach(split => {
                    heroTimeline.to(split[split.elementsClass], 
                        { 
                            yPercent: 0, 
                            duration: config.subheadingSplit.duration, 
                            stagger: config.subheadingSplit.stagger, 
                            ease: config.subheadingSplit.ease,
                            onComplete: () => {
                                if (split && split.revert) {
                                    
                                }
                            }
                        }, 
                        timing.subheading
                    );
                });
            }
            
            if (subheadingAppearElements.length > 0) {
                heroTimeline.to(subheadingAppearElements, 
                    { y: 0, opacity: 1, duration: config.appear.duration, ease: config.appear.ease }, 
                    timing.subheading
                );
            }
            
            if (tag.length > 0) {
                heroTimeline.to(tag, 
                    { y: 0, opacity: 1, duration: config.appear.duration, ease: config.appear.ease }, 
                    timing.tag
                );
            }
            
            if (buttonAllChildren.length > 0) {
                heroTimeline.to(buttonAllChildren, 
                    { y: 0, opacity: 1, duration: config.navStagger.duration, stagger: config.navStagger.stagger, ease: config.navStagger.ease }, 
                    timing.button
                );
            }
            
            if (imageElements.length > 0) {
                heroTimeline.to(imageElements, 
                    { opacity: 1, duration: config.appear.duration, ease: config.appear.ease }, 
                    timing.image
                );
            }
            
            // Combine appear elements and heading appear elements
            const allAppearElements = [...appearElements, ...headingAppearElements];
            
            if (allAppearElements.length > 0) {
                heroTimeline.to(allAppearElements, 
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: config.appear.duration, 
                        ease: config.appear.ease,
                        onComplete: () => {
                            // Restore page-wide tabbing and interactions after hero animation completes
                            const allFocusableElements = document.querySelectorAll('[data-original-tabindex]');
                            allFocusableElements.forEach(el => {
                                el.style.pointerEvents = '';
                                const originalTabindex = el.getAttribute('data-original-tabindex');
                                if (originalTabindex === '0') {
                                    el.removeAttribute('tabindex');
                                } else {
                                    el.setAttribute('tabindex', originalTabindex);
                                }
                                el.removeAttribute('data-original-tabindex');
                            });
                            // Restore nav pointer events
                            if (navElement) {
                                navElement.style.pointerEvents = '';
                            }
                        }
                    }, 
                    timing.appear
                );
            } else {
                // If no appear elements, restore tabbing when timeline completes
                heroTimeline.call(() => {
                    const allFocusableElements = document.querySelectorAll('[data-original-tabindex]');
                    allFocusableElements.forEach(el => {
                        el.style.pointerEvents = '';
                        const originalTabindex = el.getAttribute('data-original-tabindex');
                        if (originalTabindex === '0') {
                            el.removeAttribute('tabindex');
                        } else {
                            el.setAttribute('tabindex', originalTabindex);
                        }
                        el.removeAttribute('data-original-tabindex');
                    });
                    // Restore nav pointer events
                    if (navElement) {
                        navElement.style.pointerEvents = '';
                    }
                });
            }
            
            heroTimeout = null;
            
        }, config.global.animationDelay * 1000);
        
        });
    
    // API exposure
    window[API_NAME] = window[API_NAME] || {};
    window[API_NAME].heroAnimations = {
        config: config,
        updateConfig: updateConfig,
        start: startHeroAnimations,
        kill: killHeroAnimations,
        restart: () => {
            killHeroAnimations();
            startHeroAnimations();
        }
    };
    
    return { result: 'anim-hero initialized' };
}