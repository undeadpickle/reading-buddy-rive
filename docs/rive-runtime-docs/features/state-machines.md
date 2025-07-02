# State Machine Playback in Rive

**Source:** https://rive.app/docs/runtimes/state-machines  
**Scraped:** 2025-01-07  

State machines in Rive provide a way to manage animation states and transitions programmatically. Here's a comprehensive guide focusing on web/JavaScript implementation:

## Basic State Machine Initialization

```javascript
const r = new rive.Rive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    canvas: document.getElementById('canvas'),
    autoplay: true,
    stateMachines: 'bumpy',
});
```

## State Change Event Callback

```javascript
const r = new rive.Rive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    canvas: document.getElementById('canvas'),
    autoplay: true,
    stateMachines: 'bumpy',
    onStateChange: (event) => {
        stateName.innerHTML = event.data[0];
    },
});
```

## Key Concepts

- State machines combine animation states
- Can be controlled programmatically
- Support data binding and inputs
- Allow dynamic state transitions

### Recommended Practices

- Use `autoplay` to start state machines automatically
- Implement `onStateChange` callbacks to track state transitions
- Leverage state machine inputs for interactive animations

The Rive runtime supports state machine playback across multiple platforms, with consistent core principles for managing animation states.