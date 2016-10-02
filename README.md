# bg-screenshot-fx
Photoshop-style filtered transparent backgrounds. Best for dialogs and lightboxes.

# Usage
```var dialogBg = new FilterBg(targetElement, options)```

targetElement: element to attach the background effect to when visible

### options: 
```
options: {
    logging: false; // Default
    useCORS: false; // Default
    effects: {
        // Any valid CSS filter effect can be added to this object
        contrast: 300,
        hue-rotate: 90,
        saturate: 240
    }
}
```

### Methods:
update: Updates the background and shows the background if hidden. Returns a promise
clear: Removes the background
setTarget: Attach instance to a new element (Mostly for if original element is removed from DOM on hide)
setEffects: Change filter effects. Accepts an object in the same format as options.effects

# Limitations
For performance, this will only take a new screenshot of the page when the update() method is called. To work around the latency involved with taking a screenshot of the page, update() returns a promise which can run the code that changes the page after it's finished updating.

# Browser Compatibility
Because this depends on niklasvh's html2canvas project, this will only work on browsers supported by that project. https://github.com/niklasvh/html2canvas#browser-compatibility

You'll need an ES6 promise polyfill to run html2canvas on browsers without support.

# Thanks
Big thanks to everyone working on html2canvas
