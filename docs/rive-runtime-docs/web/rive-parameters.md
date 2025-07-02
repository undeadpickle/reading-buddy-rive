# Rive Parameters

**Source:** https://rive.app/docs/runtimes/web/rive-parameters  
**Scraped:** 2025-01-07  

## Parameters

You can set the following parameters when instantiating a Rive object:

```typescript
export interface RiveParameters {
  canvas: HTMLCanvasElement | OffscreenCanvas, // required
  src?: string, // one of src or buffer is required
  buffer?: ArrayBuffer, // one of src or buffer is required
  riveFile?: RiveFile,
  artboard?: string,
  animations?: string | string[],
  stateMachines?: string | string[],
  layout?: Layout,
  autoplay?: boolean,
  useOffscreenRenderer?: boolean,
  enableRiveAssetCDN?: boolean,
  shouldDisableRiveListeners?: boolean,
  isTouchScrollEnabled?: boolean,
  automaticallyHandleEvents?: boolean,
  onLoad?: EventCallback,
  onLoadError?: EventCallback,
  onPlay?: EventCallback,
  onPause?: EventCallback,
  onStop?: EventCallback,
  onLoop?: EventCallback,
  onStateChange?: EventCallback,
  onAdvance?: EventCallback,
  assetLoader?: AssetLoadCallback,
}
```

### Key Parameters

- `canvas`: Required canvas element to draw Rive animations
- `src`: Optional URL or path to `.riv` file
- `buffer`: Optional ArrayBuffer containing `.riv` file bytes
- `riveFile`: Optional previously loaded Rive runtime file object
- `artboard`: Optional name of artboard to use
- `animations`: Optional animation name(s) to play
- `stateMachines`: Optional state machine name(s) to load
- `autoplay`: Optional flag to automatically start animation (defaults to false)

## APIs

### play()

```typescript
play(names?: string | string[], autoplay?: true): void
```

Plays specified linear timeline animation(s) or state machine.

**Example**:

```typescript
import {Rive} from '@rive-app/canvas';

const riveInstance = new Rive({
  src: "https://cdn.rive.app/animations/vehicles.riv",
  autoplay: false,
  canvas: document.querySelector("canvas"),
});
```