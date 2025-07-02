# Rive Text Handling in Web/JavaScript

**Source:** https://rive.app/docs/runtimes/text  
**Scraped:** 2025-01-07  

## Overview

Rive provides powerful text manipulation capabilities for web and JavaScript runtimes. The primary recommendation is to use [Data Binding](/docs/runtimes/data-binding) for text control.

## Key Requirements

- Manually set a unique name for text runs in the Rive editor
- Export the text run name
- Ensure the name is part of the exported `.riv` file

## Reading Text

To read a text run's value:

```javascript
public getTextRunValue(textRunName: string): string | undefined
```

## Setting Text

To update a text run's value:

```javascript
public setTextRunValue(textRunName: string, textRunValue: string): void
```

## Example Usage

```javascript
import { Rive } from '@rive-app/canvas'

const r = new Rive({
  src: "my-rive-file.riv",
  artboard: "my-artboard-name",
  autoplay: true,
  stateMachines: "State Machine 1",
  onLoad: () => {
    console.log("My design-time text is, ", r.getTextRunValue("MyRun"));
    r.setTextRunValue("MyRun", "New text value");
  },
})
```

## Low-Level API

For more advanced manipulation:

```javascript
import RiveCanvas from '@rive-app/canvas-advanced';

const bytes = await (await fetch(new Request('./my-rive-file.riv'))).arrayBuffer();
const myRiveFile = await rive.load(new Uint8Array(bytes));

const artboard = myRiveFile.defaultArtboard();
const textRun = artboard.textRun("MyRun");
console.log(`My design-time text is ${textRun.text}`);
textRun.text = "Hello JS Runtime!";
```

## Nested Text Runs

You can also manipulate text in nested artboards using path-based methods:

```javascript
r.getTextRunValueAtPath("MyRun", "path/to/run")
r.setTextRunValueAtPath("MyRun", "New text", "path/to/run")
```