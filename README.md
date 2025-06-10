# Horton Studio Global Client

Animation and utility library for client websites, built for Webflow integration.

## Features

- 🎯 **Modular**: Load only what you need
- 🚀 **CDN Ready**: Works with `@hortonstudio/main@1`
- ♿ **Accessible**: Respects `prefers-reduced-motion`
- 📦 **Finsweet-Style**: Package-based dynamic imports

## Usage

```html
<script 
  type="module" 
  src="https://cdn.jsdelivr.net/npm/@hortonstudio/main@1/index.js" 
  data-hs-main 
  data-hs-anim-text 
  data-hs-anim-hero
></script>
```

## Packages

- `@hortonstudio/main` - Core library
- `@hortonstudio/main-anim-hero` - Hero animations
- `@hortonstudio/main-anim-text` - Text animations
- `@hortonstudio/main-anim-transition` - Page transitions
- `@hortonstudio/main-util-navbar` - Navigation utilities
- `@hortonstudio/main-util-toc` - Table of contents
- `@hortonstudio/main-util-progress` - Scroll progress
- `@hortonstudio/main-smooth-scroll` - Smooth scrolling

## Development

```bash
pnpm install
pnpm build
```