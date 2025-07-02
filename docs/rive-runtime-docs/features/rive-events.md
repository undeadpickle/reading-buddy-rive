# Rive Events

**Source:** https://rive.app/docs/runtimes/rive-events  
**Scraped:** 2025-01-07  

## Overview

Rive events allow developers to subscribe to meaningful signals from animations, state machines, and Rive listeners created in the Rive editor. These events have:
- A specific name
- A type
- Custom metadata

### Key Use Cases

Events can be used for:
- Coordinating audio playback
- Opening URLs
- Adding haptic feedback
- Implementing UI element functionality
- Sending semantic information

## Subscribing to Events

When subscribing to Rive events, you can:
- Subscribe to all events from a state machine
- Parse events by name or type
- Execute conditional logic based on event properties

## Event Handling Across Platforms

The documentation provides detailed event handling examples for multiple platforms:
- Web (JavaScript)
- React
- React Native
- Flutter
- Apple platforms
- Android

### Example Event Listener (Web JavaScript)

```javascript
import { Rive, EventType, RiveEventType } from '@rive-app/canvas'

const r = new Rive({
  src: "/static-assets/star-rating.riv",
  stateMachines: "State Machine 1",
});

function onRiveEventReceived(riveEvent) {
  const eventData = riveEvent.data;
  const eventProperties = eventData.properties;

  if (eventData.type === RiveEventType.General) {
    console.log("Event name", eventData.name);
    console.log("Rating", eventProperties.rating);
  } else if (eventData.type === RiveEventType.OpenUrl) {
    window.open(eventData.url);
  }
}

r.on(EventType.RiveEvent, onRiveEventReceived);
```

## Additional Resources

The documentation provides comprehensive guides for implementing Rive events across different platforms and use cases.