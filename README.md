# Phaser3 Bitmapfont Factory
This typescript class creates bitmapfonts at **runtime** ready to use in a [Phaser3](https://phaser.io) game, using default or already loaded browser fonts.  
This class resolves two problems:
1) You need to replace Phaser text with bitmapfonts to gain performance.
2) You don't want to save the same bitmapfont in several sizes for each screen resolution.  
---
## Features
* Converts any loaded font[^1] in the browser to a bitmapfont, ready to use in Phaser3 at runtime.
* Shares same texture for multiple bitmapfonts.
* Ensures power of two texture size (optional).
* Calcs kernings for 97 commonly used pairs. (optional).
* Supports list of fallback fonts.
* Predefined fallback font lists for sans-serif, sans, and monospace types.

[^1]: Fonts with ligatures are not supported.

---
## Installation
### Browser
There are two alternatives:
* Download the file [bmff.umd.js](https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-bitmapfont-factory@1.0.0/dist/bmff.umd.js) to your proyect folder and add a reference in your html:
```html
<script src = "bmff.umd.js"></script>
```  
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-bitmapfont-factory@1.0.0/dist/scrollcam.umd.js"></script>
```  
**Important**: the class is exposed as **BMFFactory**
### From NPM
```
npm i phaser3-bitmapfont-factory
```
Then you can acces the class as:
* CommonJS module:
```javascript
const BMFFactory = require('phaser3-bitmapfont-factory').default;

// In scene.create function
const bmff = new BMFFactory(this, onComplete);
```
* ES6 module:
```javascript
import BMFFactory from 'phaser3-bitmapfont-factory';

// In scene.create function
const bmff = new BMFFactory(this, onComplete);
```
---
## How to use
There are three steps:
### 1. Create an BMFFactory object:
```javascript
// In scene.create function

let bmff = new BMFFactory(this, () => {
            // your code here. 
            // i.e.: this.scene.start('nextScene');
        });
```
**BMFFactory(scene, onComplete, options)**  
Parameters:
* *scene* {Phaser.Scene}: A reference to the Phaser.Scene
* *onComplete* {Function}: callback function executed when all tasks are completed.
* *options* {Object}: optional object to set some features.
* *options.PoT* {Boolean}: The size of generated texture will be power of two?. Default: false.

### 2. Define the *tasks*
```javascript
// inside your Phaser.create() function...

// What glyphs do you want to use?
const chars = ' 0123456789abcdefghijklmnopqrstuwxyz,.';

// This adds as task the creation of a bitmapfont using "Arial" font family and calculating its kernings
bmff.make('key1', 'Arial', chars, { fontSize: '64px', color: '#555568' }, true);

// We can use fallback fonts like in css
bmff.make('key2', ['Lato', 'Lucida Grande', 'Tahoma', 'Sans-Serif'], chars, { fontSize: '64px', color: '#555568' }, true);

// BMFFactory has three predefined arrays of common web-safe and browser default fonts:
// bmff.defaultFonts.sansSerif
// bmff.defaultFonts.sans
// bmff.defaultFonts.monospace
// In this case I'm using a monospace font so I don't need kernings
bmff.make('key3', bmff.defaultFonts.monospace, chars, { fontSize: '64px', color: '#555568' }, false);
```
**make(key, fontFamily, chars, style, getKernings)**  
The method **make** creates a task to make a bitmapfont, and adds it to the queue.  
Parameters:
* *key* {String}: The key used to retrieve the created bitmapFont (i.e.: <code>this.add.bitmapText(x, y, key, 'text')</code>).
* *fontFamily* {String}: The name of any font already loaded in the browser (e.g., "Arial", "Verdana", ...), or an array of names (first valid font will be selected). Any font loaded in Phaser via WebFont can be used[^1].
* *chars* {String}: String containing the characters to use (e.g., " abcABC123/*%,."). Important: You must include the space character (" ") if you are going to use it.
* *style* {Object}: The text style configuration object (the same as the one used in Phaser.GameObjects.Text). FontName and FontFamily properties of this object are ignored.
* *getKernings* {Boolean}(optional): You are going to use the kernings?. The kernings are calculated for 97 common pairs (i.e.: 'Wa', 'y.', ...). Monospace fonts doesn't need kernings. By default is false.

### 3. Execute the tasks
```javascript
// This function must be called after adding all tasks
bmff.exec();
```
**exec()**  
This asynchronous method executes all tasks previously added to the task queue. When finished, it calls *onComplete* callback.  
  
  


---
## License
**Phaser3 Bitmapfont Factory** is licensed under the terms of the MIT open source license.

