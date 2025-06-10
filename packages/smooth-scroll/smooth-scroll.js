const API_NAME = 'hsmain';

export async function init() {
    const api = window[API_NAME];
    api.afterWebflowReady(() => {
        if (typeof $ !== 'undefined') {
            $(document).off('click.wf-scroll');
        }
    });
    
    // Disable CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Check if user prefers reduced motion
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    function getScrollOffset() {
        const offsetValue = getComputedStyle(document.documentElement)
            .getPropertyValue('--misc--scroll-offset').trim();
        return parseInt(offsetValue) || 0;
    }
    
    // Smooth scroll to element with offset
    function scrollToElement(target, offset = 0) {
        if (!target) return;
        
        // Skip animation if user prefers reduced motion
        if (prefersReducedMotion()) {
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo(0, targetPosition);
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            return;
        }
        
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: target,
                offsetY: offset
            },
            ease: "power2.out",
            onComplete: function() {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    }
    
    // Handle anchor link clicks and keyboard activation
    function handleAnchorClicks() {
        document.addEventListener('click', handleAnchorActivation);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                handleAnchorActivation(e);
            }
        });
    }
    
    function handleAnchorActivation(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            if (history.replaceState) {
                history.replaceState(null, null, `#${targetElement.id}`);
            }
            const offset = getScrollOffset();
            scrollToElement(targetElement, offset);
        }
    }
    
    // Initialize anchor link handling
    handleAnchorClicks();
    
    return {
        result: 'autoInit-smooth-scroll initialized'
    };
}