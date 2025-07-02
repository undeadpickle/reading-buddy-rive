# Web (JS) - Rive

**Source:** https://rive.app/docs/runtimes/web/web-js  
**Scraped:** 2025-01-07  

## Overview

Rive provides a web runtime library for integrating interactive animations into web applications. Key features include:

- High-level JavaScript API with TypeScript support
- Low-level Web Assembly (WASM) rendering control
- Easy integration across web platforms

## Quick Start

### Installation

Install the Rive canvas package:

```bash
# npm
npm install @rive-app/canvas

# pnpm
pnpm add @rive-app/canvas

# yarn
yarn add @rive-app/canvas
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>Rive Hello World</title>
</head>
<body>
  <canvas id="canvas" width="500" height="500"></canvas>

  <script src="https://unpkg.com/@rive-app/canvas"></script>
  <script>
    const r = new rive.Rive({
      src: "https://cdn.rive.app/animations/vehicles.riv",
      canvas: document.getElementById("canvas"),
      autoplay: true,
      stateMachines: "bumpy",
      onLoad: () => {
        r.resizeDrawingSurfaceToCanvas();
      },
    });
  </script>
</body>
</html>
```

## Loading Rive Files

Rive supports multiple file loading methods:

1. **Hosted URL**: Use a direct URL to a `.riv` file
2. **Static Assets**: Use a path to a local `.riv` file
3. **Fetching Files**: Load via `ArrayBuffer`
4. **Reusing Loaded Files**: Leverage cached `riveFile` objects

## Cleanup

Always clean up Rive instances to prevent memory leaks:

```javascript
const riveInstance = new Rive({...});
// When no longer needed
riveInstance.cleanup();
```

## Additional Resources

- [Rive Parameters](/docs/runtimes/web/rive-parameters)
- [Canvas vs WebGL](/docs/runtimes/web/canvas-vs-webgl)
- [Low-level API](/docs/runtimes/web/low-level)