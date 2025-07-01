# Rive Animation Setup Guide

## Project Setup Complete! ✅

Your Reading Buddies project is now configured to support Rive animations. Here's what has been set up:

### 1. Directory Structure
```
public/assets/buddies/kitten-ninja/
├── parts/           # Place your body part PNG/SVG files here
├── audio/           # Place voice line MP3 files here
└── config.json      # Buddy configuration

src/rive/assets/     # Place your .riv animation files here
```

### 2. Components Created
- **RiveBuddy.tsx**: Handles real Rive animations with state machine support
- **BuddyCanvas.tsx**: Smart component that uses RiveBuddy for .riv files or emoji placeholder
- **RiveDemo.tsx**: Test page for Rive animations

### 3. Configuration Updates
- **vite.config.ts**: Added support for .riv file imports
- **vite-env.d.ts**: Added TypeScript types for .riv imports
- **App.tsx**: Added tab navigation to test both demo and Rive modes

## Next Steps: Creating Your Rive Animation

### Step 1: Your Assets Are Ready! ✅
**Body Part Files**: Already placed in `public/assets/buddies/kitten-ninja/parts/`

**Available Assets**:
- **torso.png** - Main body
- **head.png** - Front head layer  
- **headBack.png** - Back head layer (for depth)
- **armLeft.png, armRight.png** - Arm layers
- **legLeft.png, legRight.png** - Leg layers
- **legSeparator.png** - Layer between legs
- **tail.png** - Tail layer
- **eyeLeft.png, eyeRight.png** - Open eyes
- **eyeBlinkLeft.png, eyeBlinkRight.png** - Closed eyes for blinking
- **egg.png** - Egg state (bonus)

**Note**: Multiple formats available (PNG, SVG, PDF) + @2x/@3x retina versions

### Step 2: Create Rive Animation
1. **Download Rive Editor** from [rive.app](https://rive.app)

2. **Create New File**:
   - Artboard name: `KittenNinja`
   - Size: 400x400px

3. **Import Your Assets**:
   - File → Import → Select body part files from `public/assets/buddies/kitten-ninja/parts/`
   - **Recommended layer order** (back to front):
     1. headBack.png (shadow/depth layer)
     2. tail.png
     3. legRight.png (back leg)
     4. legSeparator.png
     5. torso.png
     6. legLeft.png (front leg)  
     7. armRight.png (back arm)
     8. armLeft.png (front arm)
     9. head.png (main head)
     10. eyeLeft.png, eyeRight.png (open eyes)
     11. eyeBlinkLeft.png, eyeBlinkRight.png (initially hidden, for blink animation)

4. **Create Animations** (Timeline names):
   - **`Idle`** - Subtle breathing (torso scale 100% → 102%), eye blinks every 2-3 seconds
   - **`Wave`** - armLeft rotation and position animation
   - **`Jump`** - All body parts move up, torso squash/stretch
   - **`Cheer`** - Both arms up, slight hop, happy expression
   - **`Sad`** - Arms and head droop, slower breathing

5. **Eye Blink Animation Tips**:
   - Set eyeLeft/eyeRight opacity to 0% during blink frames
   - Set eyeBlinkLeft/eyeBlinkRight opacity to 100% during blink frames
   - Blink duration: 3-4 frames (fast blink)

5. **Set Up State Machine**:
   - Name: `BuddyController`
   - Add input: `playGesture` (Trigger type)
   - Create states and transitions

6. **Export**:
   - File → Export → Download as .riv
   - Save as: `kitten-ninja.riv`

### Step 3: Integrate with Project
1. **Copy .riv file** to: `src/rive/assets/kitten-ninja.riv`

2. **Update RiveDemo.tsx**:
   ```typescript
   // Uncomment this line at the top
   import kittenNinjaRiv from '@/rive/assets/kitten-ninja.riv'
   
   // Update the src prop in BuddyCanvas
   src={isRiveMode ? kittenNinjaRiv : 'demo'}
   ```

3. **Test Your Animation**:
   - Run `npm run dev`
   - Navigate to "Rive Animation Test" tab
   - Toggle "Use Rive Animation"
   - Click on buddy to test interactions

## Testing Checklist
- [ ] Animation loads without errors
- [ ] Click triggers wave gesture
- [ ] File size is under 100KB
- [ ] Animations run at 60fps
- [ ] State transitions are smooth

## Troubleshooting

### Animation Not Loading?
- Check console for errors
- Verify .riv file path is correct
- Ensure file is in `src/rive/assets/`

### Gestures Not Working?
- Verify state machine name is `BuddyController`
- Check input name is `playGesture`
- Ensure it's a Trigger type input

### Performance Issues?
- Optimize in Rive Editor (simplify paths, reduce keyframes)
- Check file size (target < 100KB)
- Use browser DevTools Performance tab

## Resources
- [Rive Documentation](https://help.rive.app)
- [Rive React Runtime](https://help.rive.app/runtimes/overview/react)
- [State Machine Guide](https://help.rive.app/editor/state-machine)

## Demo Available
Visit http://localhost:3000 and click "Rive Animation Test" tab to see:
- Toggle between demo (emoji) and Rive mode
- Instructions for creating and integrating .riv files
- Error handling for missing animations

Ready to bring your buddy to life! 🎨✨