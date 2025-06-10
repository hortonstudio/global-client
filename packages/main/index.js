// ver 1.2.12

const API_NAME = 'hsmain';

// Main initialization function
const initializeHsMain = () => {
    // Handle existing API
    if (window[API_NAME] && !Array.isArray(window[API_NAME]) && window[API_NAME].loaded) {
        return;
    }

    // Store any early API calls
    const existingRequests = Array.isArray(window[API_NAME]) ? window[API_NAME] : [];

    // Module definitions
    const animationModules = {
        "data-hs-anim-text": true,
        "data-hs-anim-hero": true,
        "data-hs-anim-transition": true
    };

    const utilityModules = {
        "data-hs-util-toc": true,
        "data-hs-util-progress": true,
        "data-hs-util-navbar": true
    };

    const autoInitModules = {
        "smooth-scroll": true
    };

    // All available modules
    const allModules = { ...animationModules, ...utilityModules };

    // Dynamic module loader (like Finsweet)
    const loadModule = async (moduleName) => {
        switch (moduleName) {
            case "data-hs-anim-text":
                return import('@hortonstudio/main-anim-text');
            case "data-hs-anim-hero":
                return import('@hortonstudio/main-anim-hero');
            case "data-hs-anim-transition":
                return import('@hortonstudio/main-anim-transition');
            case "data-hs-util-toc":
                return import('@hortonstudio/main-util-toc');
            case "data-hs-util-progress":
                return import('@hortonstudio/main-util-progress');
            case "data-hs-util-navbar":
                return import('@hortonstudio/main-util-navbar');
            case "smooth-scroll":
                return import('@hortonstudio/main-smooth-scroll');
            default:
                throw new Error(`${API_NAME} module "${moduleName}" is not supported.`);
        }
    };

    // Webflow ready helper (like Finsweet)
    const waitWebflowReady = async () => {
        return new Promise((resolve) => {
            window.Webflow ||= [];
            window.Webflow.push(resolve);
        });
    };

    // DOM ready helper (like Finsweet)
    const waitDOMReady = async () => {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    };

    // Find script tags (with CDN version redirect support)
    let scripts = [...document.querySelectorAll(`script[type="module"][src="${import.meta.url}"]`)];
    
    // Handle CDN version redirects (e.g., @1 -> @1.2.11)
    if (scripts.length === 0) {
        const allScripts = [...document.querySelectorAll('script[type="module"][src*="@hortonstudio/main"]')];
        scripts = allScripts.filter(script => {
            const src = script.src;
            const metaUrl = import.meta.url;
            // Extract package name and check if they match (ignoring version differences)
            const srcPackage = src.match(/@hortonstudio\/main(@[\d.]+)?/)?.[0];
            const metaPackage = metaUrl.match(/@hortonstudio\/main(@[\d.]+)?/)?.[0];
            return srcPackage && metaPackage && srcPackage.split('@')[0] === metaPackage.split('@')[0];
        });
    }

    // Module loading function
    const loadHsModule = async (moduleName) => {
        const apiInstance = window[API_NAME];
        
        // Check if already processing
        if (apiInstance.process.has(moduleName)) {
            return apiInstance.modules[moduleName]?.loading;
        }
        
        // Add to processing set
        apiInstance.process.add(moduleName);
        
        // Create module object
        const moduleObj = apiInstance.modules[moduleName] || {};
        apiInstance.modules[moduleName] = moduleObj;
        
        // Create loading promise
        moduleObj.loading = new Promise((resolve, reject) => {
            moduleObj.resolve = resolve;
            moduleObj.reject = reject;
        });
        
        try {
            const { init, version } = await loadModule(moduleName);
            const initResult = await init();
            const { result, destroy } = initResult || {};
            
            moduleObj.version = version;
            
            // Add destroy and restart methods
            moduleObj.destroy = () => {
                destroy?.();
                apiInstance.process.delete(moduleName);
            };
            
            moduleObj.restart = () => {
                moduleObj.destroy?.();
                return apiInstance.load(moduleName);
            };
            
            moduleObj.resolve?.(result);
            delete moduleObj.resolve;
            delete moduleObj.reject;
            
            return result;
            
        } catch (error) {
            moduleObj.reject?.(error);
            apiInstance.process.delete(moduleName);
            throw error;
        }
    };

    // Store callbacks to run after initialization
    const postWebflowCallbacks = [];

    // Initialize API
    window[API_NAME] = {
        scripts,
        modules: {},
        process: new Set(),
        load: loadHsModule,
        loaded: false,
        
        // Push method for queuing
        push(...requests) {
            for (let [moduleName, callback] of requests) {
                if (typeof callback === 'function') {
                    this.modules[moduleName]?.loading?.then(callback);
                } else {
                    this.load(moduleName);
                }
            }
        },
        
        // Destroy all modules
        destroy() {
            for (let moduleName in this.modules) {
                this.modules[moduleName]?.destroy?.();
            }
        },

        // API function for scripts to register post-initialization callbacks
        afterReady(callback) {
            if (typeof callback === 'function') {
                if (this.loaded) {
                    callback();
                } else {
                    postWebflowCallbacks.push(callback);
                }
            }
        },
        
        // Legacy alias for Webflow compatibility
        afterWebflowReady(callback) {
            if (typeof callback === 'function') {
                if (this.loaded) {
                    callback();
                } else {
                    postWebflowCallbacks.push(callback);
                }
            }
        },
        
        // Status method
        status(moduleName) {
            if (!moduleName) {
                return {
                    loaded: Object.keys(this.modules),
                    loading: [...this.process],
                    animations: Object.keys(animationModules),
                    utilities: Object.keys(utilityModules),
                    autoInit: Object.keys(autoInitModules)
                };
            }
            return {
                loaded: !!this.modules[moduleName],
                loading: this.process.has(moduleName)
            };
        }
    };

    // Process modules from script tags
    const processScriptModules = () => {
        for (const script of scripts) {
            // Check for auto mode
            const autoMode = script.getAttribute('data-hs-auto') === 'true';
            
            // Load modules based on script attributes
            for (const moduleName of Object.keys(allModules)) {
                if (script.hasAttribute(moduleName)) {
                    loadHsModule(moduleName);
                }
            }
            
            // Auto-discovery mode
            if (autoMode) {
                waitDOMReady().then(() => {
                    const foundModules = new Set();
                    const allElements = document.querySelectorAll('*');
                    
                    for (const element of allElements) {
                        for (const attrName of element.getAttributeNames()) {
                            // Look for data-hs-* attributes
                            const match = attrName.match(/^(data-hs-(?:anim|util)-[^-=]+)/)?.[1];
                            if (match && allModules[match]) {
                                foundModules.add(match);
                            }
                        }
                    }
                    
                    for (const moduleName of foundModules) {
                        loadHsModule(moduleName);
                    }
                });
            }
        }
        
        // Always load auto-init modules
        for (const moduleName of Object.keys(autoInitModules)) {
            loadHsModule(moduleName);
        }
        
        // Hide .transition elements if transition module is not loaded
        const hasTransition = scripts.some(script => script.hasAttribute('data-hs-anim-transition'));
        if (!hasTransition) {
            const transitionElements = document.querySelectorAll('.transition');
            transitionElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    };

    // Handle rich text blocks
    const richTextBlocks = document.querySelectorAll('.w-richtext');
    richTextBlocks.forEach(block => {
        const images = block.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'eager';
        });
    });

    // Main initialization
    const initializeMain = async () => {
        // Process script modules
        processScriptModules();
        
        // Wait for Webflow
        await waitWebflowReady();
        
        // Mark as loaded
        window[API_NAME].loaded = true;
        
        // Run all registered post-Webflow callbacks
        postWebflowCallbacks.forEach((callback) => {
            try {
                callback();
            } catch (error) {
                // Silent fail for callbacks
            }
        });
    };

    // Process any early requests
    window[API_NAME].push(...existingRequests);

    // Start initialization
    initializeMain().catch(() => {
        // Silent fail for initialization
    });
};

// Run initialization
initializeHsMain();