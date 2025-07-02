# React

**Source:** https://rive.app/docs/runtimes/react/react  
**Scraped:** 2025-01-07  

## Overview

The React runtime for Rive is an open-source library that provides a React component and custom hooks to integrate Rive animations into web applications. It wraps the `@rive-app/canvas` runtime and exposes types and Rive instance functionality.

## Quick Start

### Installation

Install the recommended dependency:

```bash
npm i --save @rive-app/react-canvas
```

### Basic Usage

Render a simple Rive animation:

```jsx
import Rive from '@rive-app/react-canvas';

export const Simple = () => (
  <Rive
    src="https://cdn.rive.app/animations/vehicles.riv"
    stateMachines="bumpy"
  />
);
```

### Using useRive Hook

The `useRive` hook provides more control over the Rive animation:

```jsx
import { useRive } from '@rive-app/react-canvas';

export default function Simple() {
  const { rive, RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    stateMachines: "bumpy",
    autoplay: false,
  });

  return (
    <RiveComponent
      onMouseEnter={() => rive && rive.play()}
      onMouseLeave={() => rive && rive.pause()}
    />
  );
}
```

## Rendering Considerations

It's recommended to isolate `useRive` in its own wrapper component when conditionally rendering to ensure proper cleanup and re-rendering.

## Resources

- **GitHub**: https://github.com/rive-app/rive-react
- **Types**: https://github.com/rive-app/rive-react/blob/main/src/types.ts

### Example Links
- Simple skinning example: https://codesandbox.io/p/sandbox/rive-skins-ctcnlx
- Storybook demo: https://rive-app.github.io/rive-react/