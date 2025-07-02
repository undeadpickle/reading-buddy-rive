# React Native

**Source:** https://rive.app/docs/runtimes/react-native/react-native  
**Scraped:** 2025-01-07  

## Overview

React Native runtime for Rive. Note that certain Rive features may not be fully supported for all runtimes.

## Getting Started

Follow these steps to integrate Rive into your React Native app:

### 1. Install the Dependency

```bash
npm install rive-react-native
# or for Yarn
yarn add rive-react-native
```

### 2. iOS - Pod Install

Navigate to the `ios` folder and run:

```bash
pod install
```

**Note**: Ensure your iOS deployment target is at least version 14.0.

### 3. Android - Kotlin Dependency Resolution

Add the following to your application's `build.gradle`:

```gradle
dependencies {
    implementation platform('org.jetbrains.kotlin:kotlin-bom:1.8.0')
    ...
}
```

### 4. Add the Rive Component

```javascript
import Rive from 'rive-react-native';

function App() {
  return <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      style={{width: 400, height: 400}}
  />;
}
```

## Resources

- GitHub: [https://github.com/rive-app/rive-react-native](https://github.com/rive-app/rive-react-native)
- Demo App: [https://github.com/rive-app/rive-react-native/tree/main/example](https://github.com/rive-app/rive-react-native/tree/main/example)
- Weather App: [https://github.com/rive-app/weather-app-mobile](https://github.com/rive-app/weather-app-mobile)