# Reading Buddies Rive - Project Context

## Overview
A web-based kids' reading platform featuring an animated "Buddy System" built with Rive animations. Children hatch, befriend, and customize animated buddies that react to reading progress and celebrate achievements.

**Current Status**: ✅ **RIVE BEST PRACTICES IMPLEMENTED** - Complete migration to official Rive React integration! Kitten ninja character loads using useRive hook, follows latest Rive documentation standards, and provides robust error handling with proper fallbacks.

**Repository**: 📖 Public GitHub repo at https://github.com/undeadpickle/reading-buddy-rive
- Git initialized and all code committed
- Latest Rive best practices implementation pushed
- Ready for collaborative development

## Documentation
- **PRD**: `/docs/buddy_system_prd_v2.md` - Product requirements and specification
- **README**: `/README.md` - Project overview and quick start guide
- **This File**: Development context and common commands

## Technology Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Animation**: Rive (@rive-app/react-canvas)
- **Testing**: Vitest, @testing-library/react
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier

## Key Features (From PRD)
- Egg hatching system for unlocking buddies
- Animated buddies with emotional states and gestures
- Accessory customization system
- Audio/voice lines synchronized with animations
- Progress tracking tied to reading milestones
- Offline support with IndexedDB

## Architecture Overview

### **Phase 2: Rive Best Practices Architecture (Current)**
- **Official Integration**: Complete migration to `@rive-app/react-canvas` package
- **useRive Hook Pattern**: Modern React hooks approach following Rive's latest documentation
- **Event-Driven Architecture**: Proper Rive event handling with onStateChange and RiveEvent listeners
- **Asset Loading Best Practices**: Simplified asset handling that leverages Rive's built-in systems
- **Graceful Fallbacks**: Robust error handling for missing state machines and failed loads
- **Memory Management**: Proper cleanup and resource management following Rive guidelines
- **Type Safety**: Comprehensive TypeScript coverage with strict configuration

### **Core Patterns**
- **Context Pattern**: Global Rive state management through React Context
- **Manager Pattern**: Business logic separated into focused manager classes
- **Hook Pattern**: React integration layer with custom hooks
- **Component Pattern**: Isolated, reusable UI components
- **Analytics Pattern**: Event-driven analytics with COPPA compliance

## Performance Requirements
- First Buddy payload: ≤ 400 KB gzipped
- Subsequent Buddies: ≤ 300 KB each
- Accessory PNG: ≤ 256 KB
- Voice line MP3: 48 kbps mono, ≤ 30 KB per line

## Common Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Git Commands
```bash
git status           # Check working tree status
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to GitHub (authentication configured)
git pull             # Pull latest changes from GitHub
```

### Testing & Demo
```bash
# ✅ RIVE BEST PRACTICES IMPLEMENTATION:
# Navigate to localhost:3000+ → "Rive Animation Test" tab
# Check "Use Rive Animation" checkbox
# Click kitten ninja to trigger wave gesture animation
# 
# Features working:
# - Official @rive-app/react-canvas integration
# - useRive hook pattern following latest Rive docs
# - Real Rive character rendering (kitten-ninja.riv)
# - Wave gesture animation with user interaction
# - Rive event handling with proper callbacks
# - Graceful fallbacks for missing state machines
# - Clean console output with no critical errors
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open Vitest UI
```

### Code Quality
```bash
npm run typecheck    # Run TypeScript compiler check
npm run format       # Format with Prettier
# Note: ESLint configuration needs adjustment for this setup
```

## Directory Structure
```
src/
  rive/
    assets/
      kitten-ninja.riv  ← ✅ WORKING Rive animation file
    index.ts          ← singleton loader + cleanup
    types.ts          ← auto-generated enums
  managers/
    BuddyManager.ts
    EggManager.ts     ← ✅ Fixed config loading
    AccessoryManager.ts
    AudioManager.ts
  hooks/
    useBuddy.ts
    useEggProgress.ts
  components/
    BuddyCanvas.tsx   ← Smart wrapper (emoji OR Rive)
    RiveBuddy.tsx     ← ✅ UPDATED useRive hook implementation
    RiveDemo.tsx      ← ✅ Test interface with success indicators
  utils/
    analytics.ts
public/
  assets/
    buddies/
      kitten-ninja/
        parts/
        audio/
        config.json
    accessories/
      hats/
      glasses/
      index.json
    eggs/
      kitten-ninja/
        egg.png
        egg-cracked.png
        hatch.mp3
      index.json
rive/
  buddies.riv          ← humanoids
  exotic/
    dragon.riv         ← code-split
```

## Key Goals & Metrics
- Increase weekly active reading sessions by 15%
- Increase median consecutive reading days by 3 days
- 5+ buddy interaction events per user per week
- 60% of users equip at least 1 accessory
- 70% of new users hatch a buddy within Day 1

## Accessibility Requirements
- Motion reduction support (`prefers-reduced-motion`)
- Screen reader support with ARIA-live announcements
- Keyboard/switch control navigation
- WCAG 2.2 AA compliance
- Audio transcripts available

## COPPA Compliance
- Hashed user IDs
- Hourly analytics batching
- Parental consent gates

## Phase Roadmap
- **✅ v0.1 Foundation (COMPLETED)**: Rive integration, kitten ninja character, wave gesture animation, GitHub setup
- **✅ v0.1.5 Best Practices (COMPLETED)**: Migration to official @rive-app/react-canvas, useRive hook pattern, Rive event handling
- **🔄 v0.2 (NEXT)** - Character Reusability: Multi-artboard architecture for efficient character variations
- **v0.3** - Additional animations: Add idle, happy, sad gestures in Rive Editor
- **v0.4** - State machines: Complex animation logic and transitions
- **v0.5** - Audio integration: Voice lines synchronized with gestures
- **v1.0** - Full buddy system: Multi-buddy unlock, accessories, analytics

## 🎯 CURRENT PRIORITY: Character Reusability Architecture
**Goal**: Implement single .riv file with multiple artboards for 70-80% file size reduction
**Progress**: ✅ Foundation upgraded to Rive best practices, ready for multi-artboard implementation
**Benefits of New Foundation**:
- Official React integration provides better artboard switching support
- useRive hook makes character variations easier to implement
- Event system ready for character-specific interactions
- Clean architecture ready for scaling

**Next Steps**:
1. **Create humanoid-buddies.riv** - Single file with multiple character artboards
2. **Update RiveBuddy component** to leverage artboard parameter in useRive hook
3. **Enhance BuddyManager** for character variation handling
4. **Update type definitions** for multi-character support
5. **Performance testing** - Verify file size and switching speed improvements

## Character Reusability Benefits (Research Findings)
- **File Size**: Single 400KB file vs multiple 300KB+ files per character
- **Performance**: Instant character switching (no network requests)
- **Maintainability**: Shared bone structure and animations across all characters
- **Scalability**: Easy addition of new character variations