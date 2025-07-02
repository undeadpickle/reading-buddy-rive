# Animation Playback in Rive

**Source:** https://rive.app/docs/runtimes/animation-playback  
**Scraped:** 2025-01-07  

## Overview

Rive provides flexible animation control across different platforms. This guide focuses on web/JavaScript implementation.

## Key Recommendations

> We strongly recommend controlling your animation(s) at runtime with a State Machine, rather than controlling them individually.

## Choosing Starting Animations

Basic web example for playing an idle animation:

```javascript
new rive.Rive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    canvas: document.getElementById('canvas'),
    animations: 'idle',
    autoplay: true
});
```

## Controlling Playback

### Callback Functions

The web runtime supports several animation event callbacks:

- `onLoad`: File loaded and ready for playback
- `onPause`: Animations pause
- `onStop`: Animations stop
- `onLoop`: Animation completes a loop

### Playback Control Example

```javascript
const truck = new rive.Rive({
    src: "https://cdn.rive.app/animations/vehicles.riv",
    artboard: "Jeep",
    canvas: document.getElementById("canvas"),
    onPlay: (event) => {
        const names = event.data;
        names.forEach((name) => {
            if (name === "idle") {
                idleButton.innerHTML = "Stop Truck";
            }
        });
    },
    onPause: (event) => {
        const names = event.data;
        names.forEach((name) => {
            if (name === "idle") {
                idleButton.innerHTML = "Start Truck";
            }
        });
    }
});

// Play/Pause specific animations
idleButton.onclick = () =>
    truck.playingAnimationNames.includes("idle")
        ? truck.pause("idle")
        : truck.play("idle");
```

## Best Practices

- Use state machines for complex animation coordination
- Leverage callback functions for responsive UI updates
- Utilize `play()`, `pause()`, and `stop()` methods for granular control