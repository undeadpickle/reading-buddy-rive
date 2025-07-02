# Rive Animation Setup Guide

## Project Setup Complete! ✅

Your Reading Buddies project is now configured with modern Rive best practices using the official `@rive-app/react-canvas` integration.

### Current Implementation Status

#### ✅ Completed (v0.1.5 - Rive Best Practices)
- **Modern Integration**: Using `@rive-app/react-canvas` package with useRive hook pattern
- **Event Handling**: Proper Rive event listeners with onStateChange and RiveEvent callbacks
- **Asset Loading**: Simplified approach that leverages Rive's built-in systems
- **Error Handling**: Graceful fallbacks for missing state machines and failed loads
- **Memory Management**: Proper cleanup and resource management following Rive guidelines

#### 🔄 Ready for Implementation (v0.2 - Multi-Artboard)
- **Code Infrastructure**: Complete support for character switching via artboard parameter
- **Multi-Character Demo**: UI framework ready for testing multiple characters
- **Type System**: CharacterType enum and interfaces in place

## Directory Structure
```
src/
  rive/
    assets/
      kitten-ninja.riv          ← ✅ Current working file
      humanoid-buddies.riv      ← 🎯 Target multi-artboard file
  components/
    RiveBuddy.tsx              ← ✅ Modern useRive hook implementation
    BuddyCanvas.tsx            ← ✅ Smart wrapper (emoji OR Rive)
    RiveDemo.tsx               ← ✅ Single character test interface
    MultiCharacterDemo.tsx     ← ✅ Multi-character switching UI (ready for multi-artboard)
  managers/
    BuddyManager.ts            ← ✅ Character management logic
    AudioManager.ts            ← ✅ Audio synchronization
```

## Current Working Features

### 1. Rive Animation Test
- Navigate to **"Rive Animation Test"** tab
- Check **"Use Rive Animation"** checkbox
- Click kitten ninja to trigger wave gesture animation
- **Status**: ✅ Working with clean console output

### 2. Multi-Character Demo
- Navigate to **"🎭 Multi-Character"** tab  
- Select different character types from dropdown
- Currently uses single kitten-ninja.riv file for all characters
- **Ready for**: Multi-artboard file with instant character switching

## Creating Multi-Artboard .riv File (v0.2 Target)

### Required Artboards
Create a single `humanoid-buddies.riv` file with these artboards:
- **KittenNinja** (current character)
- **PuppyWizard** 
- **BearKnight**
- **DragonMage**

### Step-by-Step Guide

1. **Download Rive Editor** from [rive.app](https://rive.app)

2. **Create Base Character**:
   - Start with existing kitten-ninja character structure
   - Create shared bone/armature system for humanoid characters
   - Artboard size: 400x400px

3. **Add Multiple Artboards**:
   - Duplicate base artboard for each character type
   - Name artboards exactly: `KittenNinja`, `PuppyWizard`, `BearKnight`, `DragonMage`
   - Share bone structure and animations across all artboards

4. **Shared Animations** (all artboards):
   - **`gesture_wave`** - Wave gesture (currently working)
   - **`idle`** - Breathing animation
   - **`gesture_jump`** - Jump animation
   - **`gesture_sad`** - Sad expression
   - **`gesture_cheer`** - Happy celebration

5. **Character-Specific Textures**:
   - Mark textures as "Referenced" assets (not embedded)
   - Let Rive handle asset loading automatically
   - Use consistent naming across characters

6. **Export**:
   - Save as: `humanoid-buddies.riv`
   - Target size: ~400KB (vs 4×300KB+ for separate files)

### Integration Steps

1. **Place .riv File**: Copy to `src/rive/assets/humanoid-buddies.riv`

2. **Update MultiCharacterDemo**: Change one line in `MultiCharacterDemo.tsx`:
   ```typescript
   // Change from:
   src="/src/rive/assets/kitten-ninja.riv" 
   // To:
   src="/src/rive/assets/humanoid-buddies.riv"
   ```

3. **Test Character Switching**:
   - Navigate to "🎭 Multi-Character" tab
   - Select different characters from dropdown
   - Verify instant switching between artboards
   - Monitor console for clean loading

## Modern Implementation Details

### useRive Hook Pattern
```typescript
const { rive, RiveComponent } = useRive({
  src: 'humanoid-buddies.riv',
  artboard: 'KittenNinja',           // Character switching parameter
  stateMachines: 'BuddyController',   // Optional state machine
  autoplay: true,
  layout: new Layout({
    fit: Fit.Contain,
    alignment: Alignment.Center,
  }),
  onLoad: handleLoad,
  onStateChange: handleStateChange,   // Modern event handling
})
```

### Simplified Asset Loading
```typescript
// Current approach - let Rive handle assets automatically
const createAssetLoader = (characterType?: CharacterType) => {
  return (asset: any, bytes: Uint8Array) => {
    // Log asset loading for monitoring
    console.log(`Letting Rive handle character asset automatically: ${asset.name}`)
    return false // Let Rive runtime handle it
  }
}
```

## Testing Checklist

### Current Features (v0.1.5)
- [ ] Kitten ninja loads in "Rive Animation Test" tab
- [ ] Wave gesture animation plays on click
- [ ] Clean console output (no critical errors)
- [ ] Character switching UI in "Multi-Character" tab
- [ ] Asset loading events tracked and displayed

### Multi-Artboard Features (v0.2 - When .riv file ready)
- [ ] All 4 characters load from single file
- [ ] Instant character switching (no network requests)
- [ ] File size reduction (single 400KB vs 4×300KB+)
- [ ] Shared animations work across all characters
- [ ] Asset loading optimized

## Performance Targets

### File Size Benefits
- **Before**: 4 characters × 300KB+ = 1.2MB+ total
- **After**: Single 400KB file = **70% reduction**

### Character Switching
- **Before**: Network request per character (300ms+)
- **After**: Instant artboard parameter change (<100ms)

## Troubleshooting

### Animation Not Loading?
- Check browser console for errors
- Verify `.riv` file path is correct
- Ensure using `@rive-app/react-canvas` package (not canvas)

### Character Switching Not Working?
- Verify artboard names match exactly: `KittenNinja`, `PuppyWizard`, etc.
- Check multi-artboard file structure in Rive Editor
- Monitor `getArtboardName()` function output in console

### Performance Issues?
- Check file size (target: single 400KB file)
- Monitor browser DevTools Performance tab
- Verify shared bone structure in Rive Editor

## Resources

### Official Rive Documentation
- [React Runtime Guide](https://rive.app/docs/runtimes/react/react)
- [useRive Hook Documentation](https://github.com/rive-app/rive-react)
- [Asset Loading Best Practices](https://rive.app/docs/runtimes/loading-assets)

### Project Documentation
- `docs/MULTI_ARTBOARD_ARCHITECTURE.md` - Detailed technical implementation
- `CLAUDE.md` - Project roadmap and current status
- `README.md` - Project overview and quick start

## Current Status Summary

🟢 **v0.1.5 Complete**: Modern Rive integration with best practices  
🟡 **v0.2 Ready**: Multi-artboard infrastructure complete, waiting for .riv file  
🔵 **v0.3 Planned**: Additional animations and state machines  

**Primary Next Task**: Create multi-artboard `humanoid-buddies.riv` file in Rive Editor to unlock character switching with 70% file size reduction! 🚀