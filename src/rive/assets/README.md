# Rive Animation Files

This directory contains the .riv animation files for the buddy system.

## Creating Your First Rive Animation

### 1. Download Rive Editor
- Go to [rive.app](https://rive.app) and download the desktop editor
- Create a free account to save your work

### 2. Create Kitten Ninja Animation

#### Artboard Setup
- Create new file in Rive
- Set artboard name: `KittenNinja`
- Set size: 400x400px

#### Import Assets
If you have body part images:
1. File → Import → Select your PNG/SVG files
2. Arrange in layers:
   - Background
   - Shadow
   - Body
   - Back Arm
   - Back Leg
   - Front Leg
   - Front Arm
   - Head
   - Eyes
   - Mouth
   - Accessories (empty group for later)

#### Create Animations
1. **Idle Animation** (Timeline: Idle)
   - 0-60 frames (2 seconds at 30fps)
   - Subtle breathing: Scale body 100% → 102% → 100%
   - Eye blink at frame 30
   - Loop enabled

2. **Wave Animation** (Timeline: Wave)
   - 0-45 frames (1.5 seconds)
   - Raise front arm and wave
   - Return to idle position

3. **Jump Animation** (Timeline: Jump)
   - 0-30 frames (1 second)
   - Squash down, then spring up
   - Land with slight squash

4. **Cheer Animation** (Timeline: Cheer)
   - 0-45 frames (1.5 seconds)
   - Both arms up
   - Small hop
   - Happy expression

5. **Sad Animation** (Timeline: Sad)
   - 0-60 frames (2 seconds)
   - Droop head and arms
   - Slow breathing
   - Loop enabled

#### State Machine Setup
1. Create State Machine: `BuddyController`

2. Add Inputs:
   - `playGesture` (Trigger) - For one-shot animations
   - `emotionState` (Number, 0-5) - For mood states
   - `isActive` (Boolean) - For active/idle state

3. Create States:
   - **Idle** (default, plays Idle animation)
   - **Wave** (plays Wave animation)
   - **Jump** (plays Jump animation)
   - **Cheer** (plays Cheer animation)
   - **Sad** (plays Sad animation)

4. Add Transitions:
   - Idle → Wave (when playGesture fires)
   - Idle → Jump (when playGesture fires + custom condition)
   - Idle → Cheer (when playGesture fires + custom condition)
   - Any State → Sad (when emotionState == 4)
   - Wave/Jump/Cheer → Idle (on animation complete)
   - Sad → Idle (when emotionState != 4)

5. Set Transition Duration: 200-300ms for smooth blending

### 3. Export Animation
1. File → Export → Download → .riv format
2. Save as: `kitten-ninja.riv`
3. Copy to this directory: `src/rive/assets/`

### 4. Optimization Tips
- Keep file size under 100KB
- Use simple shapes where possible
- Minimize keyframes
- Reuse animations with state machine logic
- Test performance on low-end devices

## File Naming Convention
- Buddy animations: `[buddy-id].riv` (e.g., `kitten-ninja.riv`)
- Egg animations: `egg-[buddy-id].riv`
- Special effects: `fx-[effect-name].riv`

## Testing Your Animation
1. Place .riv file in this directory
2. Update the demo to use your file:
   ```typescript
   import kittenNinjaRiv from '@/rive/assets/kitten-ninja.riv'
   ```
3. Run `npm run dev` and test interactions