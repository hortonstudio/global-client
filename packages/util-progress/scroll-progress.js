export async function init() {
    const progressBar = document.querySelector('[data-hs-progress="bar"]');
    const progressContent = document.querySelector('[data-hs-progress="wrapper"]');
    
    // Check if elements exist before using them
    if (!progressBar || !progressContent) {
        return {
            result: 'util-scroll-progress initialized'
        };
    }

    gsap.set(progressBar, { width: "0%" });

    // Create the scroll progress animation
    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: progressContent,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
        }
    });

    return {
        result: 'util-scroll-progress initialized'
    };
}