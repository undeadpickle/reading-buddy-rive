# Rive Runtime Documentation - Local Archive

**Scraped Date:** 2025-01-07  
**Source:** https://rive.app/docs/runtimes/  
**Purpose:** Offline reference for Reading Buddies Rive project  

This directory contains a curated collection of Rive runtime documentation focused on web development and React integration. All pages have been converted to markdown for offline access and version control.

## 📁 Documentation Structure

### 🌐 Core Runtime Documentation

- **[Getting Started](./getting-started.md)** - Overview of Rive runtimes, platform support, and licensing
- **[Web (JS)](./web/web-js.md)** - JavaScript/Web runtime installation and basic usage
- **[React](./react/react.md)** - React-specific runtime with hooks and components

### ⚙️ Web Configuration

- **[Rive Parameters](./web/rive-parameters.md)** - Complete API reference for Rive configuration options

### 🎮 Animation Control & Features

- **[Loading Assets](./features/loading-assets.md)** - **CRITICAL FOR YOUR PROJECT** - Asset Handler API for dynamic loading
- **[Animation Playback](./features/animation-playback.md)** - Control animation play/pause/stop
- **[State Machines](./features/state-machines.md)** - State machine control for buddy gestures
- **[Rive Events](./features/rive-events.md)** - Event handling and custom triggers
- **[Text](./features/text.md)** - Dynamic text manipulation in animations

## 🎯 Most Relevant for Your Project

### Asset Handler API (Loading Assets)
**Location:** `./features/loading-assets.md`  
**Why Important:** This is exactly what you need for dynamic buddy parts swapping from CDN

### React Runtime
**Location:** `./react/react.md`  
**Why Important:** Your project uses @rive-app/react-canvas

### State Machines
**Location:** `./features/state-machines.md`  
**Why Important:** Controls buddy gestures (wave, jump, etc.)

### Rive Parameters
**Location:** `./web/rive-parameters.md`  
**Why Important:** Configuration options for artboard selection and asset loading

## 🔗 Quick Reference Links

| Feature | Local File | Original URL |
|---------|------------|--------------|
| Asset Handler API | [loading-assets.md](./features/loading-assets.md) | https://rive.app/docs/runtimes/loading-assets |
| React Integration | [react.md](./react/react.md) | https://rive.app/docs/runtimes/react/react |
| Configuration | [rive-parameters.md](./web/rive-parameters.md) | https://rive.app/docs/runtimes/web/rive-parameters |
| State Machines | [state-machines.md](./features/state-machines.md) | https://rive.app/docs/runtimes/state-machines |

## 📋 Code Examples for Your Use Case

### Dynamic Part Loading (from loading-assets.md)
```javascript
assetLoader: (asset, bytes) => {
  if (asset.isImage && characterType) {
    const partUrl = `${CDN_BASE_URL}/buddies/${characterType}/parts/${asset.name}`
    // Load character-specific parts dynamically
    return true // We're handling this asset
  }
  return false // Let runtime handle
}
```

### React Component (from react.md)
```jsx
import { useRive } from '@rive-app/react-canvas';

const { rive, RiveComponent } = useRive({
  src: 'buddy-base.riv',
  artboard: characterType,
  stateMachines: "EmotionSM",
  assetLoader: createAssetLoader(characterType)
});
```

### State Machine Control (from state-machines.md)
```javascript
const r = new rive.Rive({
  stateMachines: 'EmotionSM',
  onStateChange: (event) => {
    console.log('Buddy state changed:', event.data[0]);
  }
});
```

## 🛠️ Implementation Notes

- All examples are focused on web/JavaScript/React platforms
- Mobile platform docs excluded (not relevant for your web app)
- Code examples preserved with proper syntax highlighting
- Internal Rive links converted to local references where possible

## 📝 Usage for Your Project

1. **Reference Asset Handler API** when implementing CDN part swapping
2. **Use React examples** for component integration
3. **Check Rive Parameters** for configuration options
4. **Refer to State Machines** for gesture control implementation

---

*This documentation archive supports the Reading Buddies Rive project's multi-artboard buddy system with dynamic part swapping capabilities.*