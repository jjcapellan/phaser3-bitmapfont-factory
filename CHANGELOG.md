# v2.2.0
This version can reduce font generation time by up to 90% thanks to the implementation of a cache system.
## New improvements:
* **Cache**: By default, the calculations generated in the first run (kerning, bounds, metrics, ...) are stored in the localStorage for reuse in subsequent runs. The cache can be disabled using the new *disableCache* (default = false) option. If the browser has access restrictions to the localStorage, the cache is automatically disabled.
```javascript
const bmff1 = new BMFFactory(this);                               // cache is enabledi
const bmff2 = new BMFFactory(this, null, { disableCache: true }); // cache is disabled
```

---
---  

# v2.1.1
This version introduces minor performance improvements.

# v2.1.0
This version only includes optimization changes.
## New improvements:
* **Performance improvement**: The drawing of glyphs in the texture has been optimized by activating the *willReadFrequently* option in the creation of the graphic context.

---
---

# v2.0.0
This version makes the bitmapFont texture without using Phaser.  
This change has caused the position and size of *BitmapText* to differ slightly from previous versions. So, while no breaking changes have occurred, I have decided to increment the major version.

## New improvements:
* **Reduced size of the generated texture**: Previously, the offsets for each glyph were not calculated, which caused whitespace to be included within the glyph's frame. Now, offsets are calculated based on the metrics, ensuring frames are the same size as the glyphs.
* **New texture rendering**: A dedicated graphic context is now used to generate the texture on a canvas element. Previously, a *Phaser.GameObjects.RenderTexture* object was used, drawing multiple *Phaser.GameObjects.Text* objects on it.
* **Performance improvement**

## Fixes:
* **Incorrect font verification**: Due to changes in the *FontFaceSet* API across various browsers for privacy reasons, it is no longer possible to use the *check()* method of this API to verify font availability. The verification now uses a method based on comparing metrics between the browser's default font and the desired font.
* **Rendering artifacts**: This issue arose in Phaser v3.85.2+. The solution was change the way bitmapfont texture is created. Previously, adding a 1px padding was attempted without success.

---
---

# v1.1.1
This version adds support for Phaser 3.60.x versions. With the changes made in this version of Phaser the fonts are generated four times faster.  
## Fixes
* Internal function **makeTexture()** was not working due to Phaser breaking change on RenderTexture object.  

---
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