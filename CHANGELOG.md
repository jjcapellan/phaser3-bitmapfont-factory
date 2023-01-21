# v1.1.1
This version adds support for Phaser 3.60.x versions. With the changes made in this version of Phaser the fonts are generated four times faster.  
## Fixes
* Internal function **makeTexture()** was not working due to Phaser breaking change on RenderTexture object.  

---

# v1.1.0
Bitmapfont generation can take some time if there are many glyphs, especially on low end hardware. On the other hand, the generation process uses the Phaser rendering context, so is not possible draw on screen during the process.  
The two previous circumstances together are not desirable, so in this version I have implemented an optional callback (onProgress) that allows us to draw on screen during the generation process. This way we could for example display a progress bar.  
## New features
* **onProgress: (progress: number) => void** : optional callback function executed two times per font. Receives a number between 0 and 1 (total progress).  
Example:
```javascript
// In scene.create function
let txt = this.add.text(400, 300, 'Progress 0%');

const onComplete = () => { /* onComplete code */ };

const options = {
    onProgress: (p) => {
        txt.setText( 'Progress ' + Math.ceil(p * 100) + '%');
    }
}

const bmff = new BMFFactory(this, onComplete, options);
```

---  

# v1.0.0
First stable version.
## Features
* Converts any loaded font[^1] in the browser to a bitmapfont, ready to use in Phaser3 at runtime.
* Shares same texture for multiple bitmapfonts.
* Ensures power of two texture size (optional).
* Calcs kernings for 97 commonly used pairs. (optional).
* Supports list of fallback fonts.
* Predefined fallback font lists for sans-serif, sans, and monospace types.

[^1]: Fonts with ligatures are not supported.