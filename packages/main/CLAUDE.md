# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@hortonstudio/main` - an animation and utility library for client websites, primarily designed for Webflow integration. The library uses a modular ES6 system with dynamic loading based on HTML data attributes.

## Architecture

**Main API**: `window.hsmain` (configurable via `API_NAME` constant in index.js)

**Module Categories**:
- Animation modules: `data-hs-anim-*` attributes trigger loading
- Utility modules: `data-hs-util-*` attributes trigger loading  
- Auto-init modules: Always loaded automatically

**Dependencies**: Requires GSAP with ScrollTrigger and SplitText plugins

**Integration**: Designed for Webflow with `Webflow.ready()` callback system

## Module Loading System

Modules are loaded via script tag attributes:
```html
<script src="index.js" data-hs-main data-hs-anim-hero data-hs-util-toc></script>
```

Each module exports an `init()` function returning `{ result: 'module-name initialized' }`.

## Key Animation Patterns

**Hero animations** (`hero.js`): Orchestrated timeline with navigation reveals, split text headings, and staggered element appearances. Uses data attributes like `data-hs-hero="heading"` and `data-hs-split="word|line|char"`.

**Text animations** (`text.js`): Scroll-triggered animations using CSS classes `.a-word-split`, `.a-line-split`, `.a-char-split`, `.a-appear` on parent elements, targeting first child for animation.

**Configuration**: All modules expose config objects via `window.hsmain.moduleAnimations.config` with `updateConfig()` methods for runtime modification.

## Important Implementation Details

- All animations wait for `document.fonts.ready` before initialization
- Split text instances are automatically cleaned up after animations complete
- CSS utility classes like `.u-overflow-clip` are dynamically added/removed for animation masking
- The library handles Webflow DOM changes by calling `Webflow.ready()` after module loading
- Navigation accessibility is temporarily disabled during hero animations then restored