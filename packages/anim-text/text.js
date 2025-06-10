const API_NAME = 'hsmain';

// Check for reduced motion preference
const prefersReducedMotion = () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const config = {
    global: {
        animationDelay: 0
    },
    wordSplit: {
        duration: 1.5,
        stagger: 0.075,
        yPercent: 110,
        ease: "power4.out",
        start: "top 97%"
    },
    lineSplit: {
        duration: 1.5,
        stagger: 0.1,
        yPercent: 110,
        ease: "power4.out",
        start: "top 97%"
    },
    charSplit: {
        duration: 1.2,
        stagger: 0.03,
        yPercent: 110,
        ease: "power4.out",
        start: "top 97%"
    },
    appear: {
        y: 50,
        duration: 1.5,
        ease: "power3.out",
        start: "top 97%"
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

function killTextAnimations() {
    activeAnimations.forEach(({ timeline, element }) => {
        if (timeline) {
            timeline.kill();
        }
        if (element?.splitTextInstance) {
            element.splitTextInstance.revert();
        }
    });
    activeAnimations.length = 0;
}

function startTextAnimations() {
    if (prefersReducedMotion()) {
        // For reduced motion, just show elements without animation
        showElementsWithoutAnimation();
        return;
    }
    
    setInitialStates().then(() => {
        initAnimations();
    });
}

let activeAnimations = [];

function waitForFonts() {
    return document.fonts.ready;
}

function showElementsWithoutAnimation() {
    // Simply show all text elements without any animation or split text
    const allTextElements = [
        ...document.querySelectorAll(".a-char-split > *:first-child"),
        ...document.querySelectorAll(".a-word-split > *:first-child"),
        ...document.querySelectorAll(".a-line-split > *:first-child"),
        ...document.querySelectorAll('.a-appear')
    ];
    
    allTextElements.forEach(element => {
        gsap.set(element, { 
            autoAlpha: 1, 
            y: 0, 
            yPercent: 0, 
            opacity: 1 
        });
    });
}

const CharSplitAnimations = {
    async initial() {
        await waitForFonts();
        
        if (prefersReducedMotion()) {
            return;
        }
        
        const elements = document.querySelectorAll(".a-char-split > *:first-child");
        
        elements.forEach((textElement) => {
            const split = SplitText.create(textElement, {
                type: "chars",
                mask: "chars",
                charsClass: "char",
            });
            textElement.splitTextInstance = split;
            
            gsap.set(split.chars, {
                yPercent: config.charSplit.yPercent
            });
            gsap.set(textElement, { autoAlpha: 1 });
        });
    },

    async animate() {
        await waitForFonts();

        if (prefersReducedMotion()) {
            return;
        }

        document.querySelectorAll(".a-char-split > *:first-child").forEach((textElement) => {
            const chars = textElement.querySelectorAll('.char');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: textElement,
                    start: config.charSplit.start,
                    invalidateOnRefresh: true,
                },
                onComplete: () => {
                    
                }
            });

            tl.to(chars, {
                yPercent: 0,
                duration: config.charSplit.duration,
                stagger: config.charSplit.stagger,
                ease: config.charSplit.ease,
            });

            activeAnimations.push({ timeline: tl, element: textElement });
        });
    }
};

const WordSplitAnimations = {
    async initial() {
        await waitForFonts();
        
        if (prefersReducedMotion()) {
            return;
        }
        
        const elements = document.querySelectorAll(".a-word-split > *:first-child");
        
        elements.forEach((textElement) => {
            const split = SplitText.create(textElement, {
                type: "words",
                mask: "words",
                wordsClass: "word",
            });
            textElement.splitTextInstance = split;
            
            gsap.set(split.words, {
                yPercent: config.wordSplit.yPercent
            });
            gsap.set(textElement, { autoAlpha: 1 });
        });
    },

    async animate() {
        await waitForFonts();

        if (prefersReducedMotion()) {
            return;
        }

        document.querySelectorAll(".a-word-split > *:first-child").forEach((textElement) => {
            const words = textElement.querySelectorAll('.word');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: textElement,
                    start: config.wordSplit.start,
                    invalidateOnRefresh: true,
                },
                onComplete: () => {
                    
                }
            });

            tl.to(words, {
                yPercent: 0,
                duration: config.wordSplit.duration,
                stagger: config.wordSplit.stagger,
                ease: config.wordSplit.ease,
            });

            activeAnimations.push({ timeline: tl, element: textElement });
        });
    }
};

const LineSplitAnimations = {
    async initial() {
        await waitForFonts();
        
        if (prefersReducedMotion()) {
            return;
        }
        
        const elements = document.querySelectorAll(".a-line-split > *:first-child");
        
        elements.forEach((textElement) => {
            const split = SplitText.create(textElement, {
                type: "lines",
                mask: "lines",
                linesClass: "line",
            });
            textElement.splitTextInstance = split;
            
            gsap.set(split.lines, {
                yPercent: config.lineSplit.yPercent
            });
            gsap.set(textElement, { autoAlpha: 1 });
        });
    },

    async animate() {
        await waitForFonts();

        if (prefersReducedMotion()) {
            return;
        }

        document.querySelectorAll(".a-line-split > *:first-child").forEach((textElement) => {
            const lines = textElement.querySelectorAll('.line');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: textElement,
                    start: config.lineSplit.start,
                    invalidateOnRefresh: true,
                },
                onComplete: () => {
                    
                }
            });

            tl.to(lines, {
                yPercent: 0,
                duration: config.lineSplit.duration,
                stagger: config.lineSplit.stagger,
                ease: config.lineSplit.ease,
            });

            activeAnimations.push({ timeline: tl, element: textElement });
        });
    }
};

const AppearAnimations = {
    async initial() {
        await waitForFonts();

        if (prefersReducedMotion()) {
            return;
        }

        const elements = document.querySelectorAll('.a-appear');
        elements.forEach(element => {
            gsap.set(element, {
                y: config.appear.y,
                opacity: 0
            });
        });
    },

    async animate() {
        await waitForFonts();

        if (prefersReducedMotion()) {
            return;
        }

        document.querySelectorAll('.a-appear').forEach(element => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    start: config.appear.start,
                    invalidateOnRefresh: true,
                }
            });

            tl.to(element, {
                y: 0,
                opacity: 1,
                duration: config.appear.duration,
                ease: config.appear.ease
            });

            activeAnimations.push({ timeline: tl, element: element });
        });

    }
};

async function setInitialStates() {
    await Promise.all([
        CharSplitAnimations.initial(),
        WordSplitAnimations.initial(),
        LineSplitAnimations.initial(),
        AppearAnimations.initial()
    ]);
}

async function initAnimations() {
    if (config.global.animationDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, config.global.animationDelay * 1000));
    }
    
    await Promise.all([
        CharSplitAnimations.animate(),
        WordSplitAnimations.animate(),
        LineSplitAnimations.animate(),
        AppearAnimations.animate()
    ]);
}

export async function init() {
    if (prefersReducedMotion()) {
        // For reduced motion, just show elements without animation
        showElementsWithoutAnimation();
    } else {
        await setInitialStates();
        initAnimations();
    }
    
    window.addEventListener('resize', ScrollTrigger.refresh());

    const api = window[API_NAME] || {};
    api.textAnimations = {
        config: config,
        updateConfig: updateConfig,
        start: startTextAnimations,
        kill: killTextAnimations,
        restart: () => {
            killTextAnimations();
            startTextAnimations();
        }
    };

    return { result: 'anim-text initialized' };
}