# Getting Started with the Rive Runtimes

**Source:** https://rive.app/docs/runtimes/getting-started  
**Scraped:** 2025-01-07  

The Rive runtimes are open-source libraries that allow you to load and control your animations in apps, games, and websites.

## Key Highlights

### Platforms Supported
- Web (JS)
- React
- React Native
- Flutter
- Apple
- Android
- Unity
- Unreal
- Community Runtimes (QtQuick, C#)

### Installation
Each runtime has specific installation methods:
- Web: Distributed via npm
- React: npm packages
- Apple: Swift Package Manager, Cocoapods
- Android: Maven
- Flutter: pub.dev
- Game Runtimes: Platform-specific methods

### Licensing
- All official runtimes are open-source
- Licensed under the MIT License
- Free for personal and commercial use

### Important Notes
- Some Rive features may not be supported on all runtimes
- Recommend checking [feature support](/feature-support) documentation
- Newest runtimes typically support previous asset versions

### Handling .riv Files
When using Git, add a `.gitattributes` file to prevent line ending issues:

```
*.riv binary
```

## Contributing
The runtimes are open-source, and contributions are encouraged. If you see areas for improvement, fork the repository and submit improvements.