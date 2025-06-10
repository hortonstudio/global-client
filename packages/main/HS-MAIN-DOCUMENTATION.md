# @hortonstudio/main - Complete Usage Guide

This is a comprehensive guide for using the `@hortonstudio/main` animation and utility library, designed for modern web applications including Webflow, Next.js, React, and vanilla JavaScript projects.

## Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Framework Integration](#framework-integration)
3. [Hero Animations](#hero-animations)
4. [Text Animations](#text-animations)
5. [Page Transitions](#page-transitions)
6. [Utility Modules](#utility-modules)
7. [Auto-Init Modules](#auto-init-modules)
8. [Configuration](#configuration)
9. [API Reference](#api-reference)

---

## Installation & Setup

### 1. Include the Script
Add this script tag to your page (preferably in the `<head>` or before closing `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/@hortonstudio/main@latest/index.js" 
        data-hs-main 
        data-hs-anim-hero 
        data-hs-util-toc></script>
```

### 2. Required Dependencies
Ensure GSAP with required plugins is loaded before the main script:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/SplitText.min.js"></script>
```

### 3. Module Loading
Modules are loaded based on data attributes on the script tag:

- `data-hs-main`: **Required** - Core library identifier
- `data-hs-anim-*`: Animation modules
- `data-hs-util-*`: Utility modules

**Example:**
```html
<script src="index.js" 
        data-hs-main 
        data-hs-anim-hero 
        data-hs-anim-text 
        data-hs-util-navbar 
        data-hs-util-progress></script>
```

---

## Framework Integration

### Webflow
The library works seamlessly with Webflow with full integration support:

```html
<script src="https://cdn.jsdelivr.net/npm/@hortonstudio/main@latest/index.js" 
        data-hs-main 
        data-hs-anim-hero 
        data-hs-util-toc></script>
```

### Next.js / React
For Next.js applications, install and use as an ES module:

```bash
npm install @hortonstudio/main
```

```javascript
// In your component or _app.js
import { useEffect } from 'react'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Load the library after component mounts
    import('@hortonstudio/main').then((lib) => {
      // Library automatically initializes
      console.log('HS Main loaded:', window.hsmain)
    })
  }, [])

  return <Component {...pageProps} />
}
```

### Vanilla JavaScript
For standard JavaScript projects:

```javascript
// Import as ES module
import '@hortonstudio/main'

// Or use CDN with script tag
// <script src="https://cdn.jsdelivr.net/npm/@hortonstudio/main@latest/index.js" data-hs-main></script>

// Access via global API
console.log(window.hsmain.status())
```

### Vue.js
```javascript
// In main.js or component
import { onMounted } from 'vue'
import '@hortonstudio/main'

export default {
  setup() {
    onMounted(() => {
      // Library ready after DOM mount
      window.hsmain.afterReady(() => {
        console.log('Animations ready!')
      })
    })
  }
}
```

### Framework-Agnostic Initialization
The library detects the environment and initializes appropriately:

- **With Webflow**: Uses `Webflow.ready()` and `Webflow.push()`
- **Without Webflow**: Uses standard DOM events and timeouts
- **Universal**: All animations and utilities work in any environment

---

## Hero Animations

Hero animations create orchestrated entrance animations for landing page elements.

### Basic Setup

#### 1. Navigation
```html
<nav data-hs-hero="nav">
  <!-- Your navigation content -->
</nav>
```

#### 2. Advanced Navigation (with staggered animations)
```html
<nav data-hs-hero="nav" data-hs-heroconfig="advanced">
  <div data-hs-hero="nav-logo">
    <!-- Logo content -->
  </div>
  <ul data-hs-hero="nav-list">
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
  </ul>
  <div data-hs-hero="nav-menu">
    <!-- Menu button -->
  </div>
  <div data-hs-hero="nav-button">
    <!-- CTA button -->
  </div>
</nav>
```

#### 3. Headings with Text Splitting
```html
<div data-hs-hero="heading" data-hs-heroconfig="word">
  <h1>Your Main Heading</h1>
</div>

<div data-hs-hero="heading" data-hs-heroconfig="line">
  <h1>Multi-line Heading That Splits by Lines</h1>
</div>

<div data-hs-hero="heading" data-hs-heroconfig="char">
  <h1>Character Split Animation</h1>
</div>
```

#### 4. Subheadings
```html
<div data-hs-hero="subheading" data-hs-heroconfig="appear">
  <h2>Simple fade-in subheading</h2>
</div>

<div data-hs-hero="subheading" data-hs-heroconfig="word">
  <h2>Word-split subheading</h2>
</div>
```

#### 5. Other Hero Elements
```html
<!-- Announcement banner -->
<div data-hs-hero="announce">
  <p>Special announcement</p>
</div>

<!-- Tag/category -->
<div data-hs-hero="tag">
  <span>Category Tag</span>
</div>

<!-- Buttons (all children animate with stagger) -->
<div data-hs-hero="button">
  <a href="#" class="btn">Primary Button</a>
  <a href="#" class="btn">Secondary Button</a>
</div>

<!-- Images -->
<img data-hs-hero="image" src="hero-image.jpg" alt="Hero Image">

<!-- General appear elements -->
<div data-hs-hero="appear">
  <p>Any content that should fade in</p>
</div>
```

### Hero Configuration Options

| Attribute Value | Description | Usage |
|----------------|-------------|--------|
| `word` | Split text by words | `data-hs-heroconfig="word"` |
| `line` | Split text by lines | `data-hs-heroconfig="line"` |
| `char` | Split text by characters | `data-hs-heroconfig="char"` |
| `appear` | Simple fade-in animation | `data-hs-heroconfig="appear"` |
| `advanced` | Enable advanced nav animations | `data-hs-heroconfig="advanced"` |

---

## Text Animations

Text animations provide scroll-triggered text splitting animations for content sections.

### Setup Classes

Add these classes to parent elements, with the actual text element as the first child:

#### 1. Word Split Animation
```html
<div class="a-word-split">
  <h2>Text that splits by words on scroll</h2>
</div>
```

#### 2. Line Split Animation
```html
<div class="a-line-split">
  <h2>Multi-line text that splits by lines</h2>
</div>
```

#### 3. Character Split Animation
```html
<div class="a-char-split">
  <h1>Text split by individual characters</h1>
</div>
```

#### 4. Simple Appear Animation
```html
<div class="a-appear">
  <p>Content that fades in on scroll</p>
</div>
```

### Important Notes
- **First child targeting**: The animation targets the **first child element** of the element with the class
- **Scroll triggered**: All text animations trigger when the element enters the viewport
- **Auto cleanup**: SplitText instances are automatically cleaned up after animation completes

---

## Page Transitions

Page transitions create smooth animations between page loads.

### Setup

#### 1. Add Transition Trigger Element
```html
<!-- This element triggers the transition animation -->
<div class="transition-trigger" style="display: none;"></div>
```

#### 2. Add Transition Overlay
```html
<!-- This element covers the screen during transitions -->
<div class="transition">
  <!-- Your transition content/animation -->
</div>
```

#### 3. Exclude Links from Transitions
```html
<!-- Links that should NOT trigger transitions -->
<a href="/page" class="no-transition">Direct Link</a>
<a href="/external" target="_blank">External Link</a>
<a href="#section">Anchor Link</a>
```

### Configuration
- **Intro Duration**: 800ms (time for page load transition)
- **Exit Duration**: 400ms (time for page exit transition)
- **Excluded**: Links with `no-transition` class, external links, anchor links
- **Auto-disable**: Transitions disable on window resize for mobile compatibility

---

## Utility Modules

### Table of Contents (TOC)
Auto-generates navigation from page headings.

```html
<!-- Container where TOC will be inserted -->
<nav data-hs-toc="container">
  <!-- TOC items will be auto-generated here -->
</nav>

<!-- Headings that should appear in TOC -->
<h2 data-hs-toc="item">Section 1</h2>
<h3 data-hs-toc="item">Subsection 1.1</h3>
<h2 data-hs-toc="item">Section 2</h2>
```

### Scroll Progress Indicator
Shows page scroll progress.

```html
<!-- Progress bar element -->
<div data-hs-progress="bar"></div>
```

### Smart Navbar
Navbar that hides/shows based on scroll direction.

```html
<nav data-hs-navbar="container">
  <!-- Your navigation content -->
</nav>
```

**Behavior:**
- Hides when scrolling down
- Shows when scrolling up
- Always visible at the top of the page
- Smooth transitions with CSS transforms

---

## Auto-Init Modules

These modules load automatically without requiring data attributes.

### Smooth Scroll
- **Automatically enabled** for all anchor links
- **Smooth scrolling** to page sections
- **Offset support** for fixed headers
- **No setup required**

---

## Configuration

### Global API Access
All modules expose configuration through the global API:

```javascript
// Access the API (default name: 'hsmain')
window.hsmain

// Check module status
window.hsmain.status() // All modules
window.hsmain.status('data-hs-anim-hero') // Specific module

// Restart a module
window.hsmain.modules['data-hs-anim-hero'].restart()
```

### Hero Animation Configuration
```javascript
// Update hero animation settings
window.hsmain.heroAnimations.updateConfig({
  global: {
    animationDelay: 0.5 // Delay before animations start
  },
  headingSplit: {
    duration: 2.0,      // Animation duration
    stagger: 0.15,      // Delay between elements
    yPercent: 120,      // Initial position offset
    ease: "power3.out"  // Easing function
  }
})

// Restart hero animations with new config
window.hsmain.heroAnimations.restart()
```

### Module Animation Configuration
```javascript
// Update text animation settings
window.hsmain.moduleAnimations.config.updateConfig({
  wordSplit: {
    duration: 1.8,
    stagger: 0.1,
    start: "top 90%" // ScrollTrigger start position
  }
})
```

---

## API Reference

### Core API Methods

```javascript
// Load a module manually
window.hsmain.load('data-hs-util-navbar')

// Check if modules are loaded/loading
window.hsmain.status()
// Returns: { loaded: [...], loading: [...], animations: [...], utilities: [...] }

// Register callback for after library initialization
window.hsmain.afterReady(() => {
  console.log('Library is ready!')
})

// Legacy Webflow callback (still supported)
window.hsmain.afterWebflowReady(() => {
  console.log('Webflow compatibility mode')
})
```

### Hero Animations API

```javascript
// Available methods
window.hsmain.heroAnimations.start()    // Start animations
window.hsmain.heroAnimations.kill()     // Stop animations
window.hsmain.heroAnimations.restart()  // Restart animations
window.hsmain.heroAnimations.config     // Current configuration
window.hsmain.heroAnimations.updateConfig(newConfig) // Update settings
```

### Timing Configuration

#### Hero Animation Timing (in seconds)
```javascript
const timing = {
  announce: 0,      // Announcement elements
  nav: 0.1,         // Main navigation
  navLogo: 0.3,     // Navigation logo
  navList: 0.35,    // Navigation links
  navMenu: 0.35,    // Menu button
  navButton: 0.5,   // CTA button
  tag: 0.1,         // Category tags
  heading: 0.15,    // Main headings
  subheading: 0.25, // Subheadings
  button: 0.35,     // Action buttons
  image: 0.5,       // Images
  appear: 0.6       // General appear elements
}
```

---

## CSS Utility Classes

The library includes these utility classes:

```css
/* Transition styles */
.transition { display: block; }
.w-editor .transition { display: none; }
.no-scroll-transition { overflow: hidden; position: relative; }

/* Split text masks */
.line-mask, .word-mask, .char-mask {
  padding-bottom: .1em;
  margin-bottom: -.1em;
  padding-inline: .1em;
  margin-inline: -.1em;
}

/* Scroll improvements */
html, body {
  overscroll-behavior: none;
  scrollbar-gutter: stable;
}
```

---

## Best Practices

### 1. Module Loading
- Only load modules you actually use
- Include required dependencies before the main script
- Use `data-hs-main` on the script tag

### 2. Hero Animations
- Structure your HTML with proper parent/child relationships
- Use semantic HTML elements (h1, h2, nav, etc.)
- Test animations on different screen sizes

### 3. Text Animations
- Place classes on parent containers, not the text elements directly
- Ensure the text element is the first child
- Consider animation timing with page scroll speed

### 4. Performance
- Animations wait for fonts to load (`document.fonts.ready`)
- SplitText instances are cleaned up automatically
- Modules only initialize when needed

### 5. Framework Integration
- **Webflow**: Full integration with Webflow's responsive design and interactions
- **React/Next.js**: Works with SSR and client-side rendering
- **Vue.js**: Compatible with reactive data and component lifecycle
- **Universal**: Framework-agnostic core ensures compatibility

---

## Troubleshooting

### Common Issues

1. **Animations not starting**
   - Check that GSAP and plugins are loaded
   - Verify data attributes are correct
   - Check browser console for errors

2. **Text splitting not working**
   - Ensure SplitText plugin is loaded
   - Check that target element is the first child
   - Verify class names are correct

3. **Module not loading**
   - Check script tag has `data-hs-main`
   - Verify module attribute name
   - Check `window.hsmain.status()` for loading state

4. **Webflow conflicts**
   - Ensure script loads after Webflow
   - Check for conflicting CSS
   - Test without other custom scripts

### Debug Commands

```javascript
// Check what's loaded
console.log(window.hsmain.status())

// Check for errors
window.hsmain.modules

// Restart problematic modules
window.hsmain.modules['module-name'].restart()
```

---

*This documentation covers version 1.1.27 of @hortonstudio/main*