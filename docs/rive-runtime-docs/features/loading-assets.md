# Loading Assets in Rive

**Source:** https://rive.app/docs/runtimes/loading-assets  
**Scraped:** 2025-01-07  

## Overview

Rive allows dynamic asset loading for files containing fonts, images, or audio. This approach offers several benefits:

- Keep `.riv` files small
- Dynamically load assets based on device
- Preload assets
- Use bundled application assets
- Share assets across multiple files

## Asset Loading Methods

### 1. Embedded Assets
- Assets included directly in the `.riv` file
- Default export option
- May increase file size

### 2. Hosted Assets (Rive CDN)
- Assets hosted on Rive's Content Delivery Network
- Not embedded in file
- Runtime loads from CDN
- Extra network call required

### 3. Referenced Assets
- Assets not embedded
- Loaded dynamically by application
- Provides maximum flexibility
- Requires custom asset handling

## Asset Handler API

Each runtime provides an asset loader callback with similar core functionality:

```javascript
assetLoader: (asset: FileAsset, bytes: Uint8Array) => boolean
```

Key parameters:
- `asset`: Contains asset metadata
- `bytes`: Asset byte array
- Return `true` to handle loading, `false` to let runtime handle

### Example (Web/JS)

```javascript
const riveInstance = new Rive({
  src: "animation.riv",
  assetLoader: (asset, bytes) => {
    if (asset.isFont) {
      // Custom font loading logic
      return true;
    }
    return false;
  }
});
```

## Platform-Specific Implementations

Each Rive runtime (Web, React, Flutter, iOS, Android) has slightly different asset loading mechanisms, but follows similar principles.

## Best Practices

- Call `unref()` on assets when no longer needed
- Handle different asset types (fonts, images, audio)
- Consider performance and network implications

## Supported Image Formats

- JPEG
- PNG
- WebP