# Phaser3 Bitmapfont Factory
This Phaser3 class creates bitmapfonts at runtime, using available browser fonts.  
This class resolves two problems:
1) You need to replace Phaser text with bitmapfonts to gain performance.
2) You don't want to save the same bitmapfont in several sizes for each screen resolution.

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
// inside your Phaser.create() function...

let bmff = new BMFFactory(this, () => {
            // your code here. 
            // i.e.: this.scene.start('menu');
        });

// Do you want some progress indicator?
bmff.setOnProgress((progress) => {
            // Your code here
            // i.e.: console.log(progress * 100);
        });
```
**BMFFactory(scene, onComplete)**  
Parameters:
* *scene*: A reference to the Phaser.Scene
* *onComplete*: callback function executed when all tasks are completed.

**setOnProgress(onProgress)**  
The creation of the bitmapfonts is an asynchronous process. The method **setOnProgress** allows you to
set a callback which will be called during the process.   
Parameters:
* *onProgress*: callback function which will be called during the tasks execution. This callback receives a number between 0 and 1 indicating the current progress. 

### 2. Define the *tasks*
```javascript
// inside your Phaser.create() function...

// What characters do you want to use?
const chars = ' 0123456789abcdefghijklmnopqrstuwxyz,.';

// This adds as task the creation of a bitmapfont using "Arial" font family and calculating its kernings
bmff.make('key1', 'Arial', chars, { fontSize: '64px', color: '#555568' }, true);

// We can use fallback fonts like in css
bmff.make('key2', ['Lato', 'Lucida Grande', 'Tahoma', 'Sans-Serif'], chars, { fontSize: '64px', color: '#555568' }, true);

// BMFFactory has three predefined arrays of common web-safe fonts:
// bmff.defaultFonts.sansSerif
// bmff.defaultFonts.sans
// bmff.defaultFonts.monospace
// In this case I'm using a monospace font so I don't need kernings
bmff.make('key3', bmff.defaultFonts.monospace, chars, { fontSize: '64px', color: '#555568' }, false);
```
**make(key, fontFamily, chars, style, getKernings)**  
The method **make** creates a task to make a bitmapfont, and adds it to the queue.  
Parameters:
* *key*: The key to be used in Phaser cache.
* *fontFamily*: The name of any font already loaded in the browser (e.g., "Arial", "Verdana", ...), or an array of names (first valid font will be selected).
* *chars*: String containing the characters to use (e.g., " abcABC123/*%,."). Important: You must include the space character (" ") if you are going to use it.
* *style*: The text style configuration object (the same as the one used in Phaser.GameObjects.Text). FontName and FontFamily properties of this object are ignored.
* *getKernings*: You are going to use the kernings?. The kernings are calculated for 97 common pairs (i.e.: 'Wa', 'y.', ...).

### 3. Execute the tasks
```javascript
// This function must be called after adding all tasks
bmff.exec();
```
**exec()**  
This method executes all tasks in the tasks queue.
---
## License
**Phaser3 Bitmapfont Factory** is licensed under the terms of the MIT open source license.

