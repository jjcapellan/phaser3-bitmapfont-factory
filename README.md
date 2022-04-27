# Phaser3 Bitmapfont Factory  

This typescript class creates bitmapfonts at **runtime** ready to use in a [Phaser3](https://phaser.io) game, using default or already loaded browser fonts.   
Try demo here: https://jjcapellan.github.io/phaser3-bitmapfont-factory/  

---
## Features
* Converts any loaded font[^1] in the browser to a bitmapfont, ready to use in Phaser3 at runtime.
* Shares same texture for multiple bitmapfonts.
* Ensures power of two texture size (optional).
* Calcs kernings for 97 commonly used pairs. (optional).[^2]
* Supports list of fallback fonts.
* Predefined fallback font lists for sans-serif, sans, and monospace types.

[^1]: Fonts with ligatures are not supported.  

[^2]: In Phaser 3.55.2/WebGL kernings are not used by bitmapText objects. This was fixed in new Phaser v3.60.  

---
## Table of contents  

* [Installation](#installation)
  * [Browser](#browser)
  * [From NPM](#from-npm)
* [How to use](#how-to-use)
  * [Create a BMFFactory object](#1-create-a-bmffactory-object)
  * [Define the tasks](#2-define-the-tasks)
  * [Execute the tasks](#3-execute-the-tasks)
* [Basic example](#basic-example)
* [License](#license)  

---
## Installation
### Browser
There are two alternatives:
* Download the file [bmff.umd.js](https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-bitmapfont-factory@1.0.0/dist/bmff.umd.js) to your project folder and add a reference in your html:
```html
<script src = "bmff.umd.js"></script>
```  
* Point a script tag to the CDN link:
```html
<script src = "https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-bitmapfont-factory@1.0.0/dist/bmff.umd.js"></script>
```  
**Important**: the class is exposed as **BMFFactory**
### From NPM
```
npm i phaser3-bitmapfont-factory
```
Then you can acces the class as:
* CommonJS module:
```javascript
const BMFFactory = require('phaser3-bitmapfont-factory/dist/bmff');

// In scene.create function
const bmff = new BMFFactory(this, onComplete);
```
* ES6 module:
```javascript
import BMFFactory from 'phaser3-bitmapfont-factory/dist/bmff.ems';

// In scene.create function
const bmff = new BMFFactory(this, onComplete);
```
---
## How to use
There are three steps:
### 1. Create a BMFFactory object:
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
* *options.onProgress* {Function}: callback function executed two times per font. Receives a number between 0 and 1 (total progress). This option will be necessary if you want to draw something on the screen during the generation process, since it uses the Phaser rendering context. Each call to this function stops the generation for 1 frame.Default: undefined.

### 2. Define the *tasks*
```javascript
// inside your Phaser.create() function...

// What glyphs do you want to use?
const chars = ' 0123456789abcdefghijklmnopqrstuwxyz,.';

// This adds as task the creation of a bitmapfont using "Arial" font family and calculating its kernings
bmff.make('key1', 'Arial', chars, { fontSize: '64px', color: '#555568' });

// We can use fallback fonts like in css
bmff.make('key2', ['Lato', 'Lucida Grande', 'Tahoma', 'Sans-Serif'], chars, { fontSize: '64px', color: '#555568' });

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
* *getKernings* {Boolean}(optional): You are going to use the kernings?. The kernings are calculated for 97 common pairs (i.e.: 'Wa', 'y.', ...). Monospace fonts doesn't need kernings. By default is true.

### 3. Execute the tasks
```javascript
// This function must be called after adding all tasks
bmff.exec();
```
**exec()**  
This asynchronous method executes all tasks previously added to the task queue. When finished, it calls *onComplete* callback.    

---

## Basic example
This example shows the generation and use of one bitmapfont in the same scene.  

Sometimes we need to generate several bitmapfonts with many glyphs. For these cases is better generate the bitmapfonts previously in a load scene (look the demo folder of this repository).  

```javascript
import Phaser from 'phaser'
import BMFFactory from 'phaser3-bitmapfont-factory/dist/bmff.ems'

class MyGame extends Phaser.Scene {
    constructor(){
        super();
    }

    create(){
        this.fontReady = false;
        this.counterBMF = null;
        this.count = 0;

        const options = { onProgress: (progress) => { console.log(progress) }; }

        // Creates a new BMFFactory object
        const bmff = BMFFactory(this, 
        ()=> {
            // Generated bitmapfont 'countFont' is now in cache ready to be used
            this.counterBMF = this.add.bitmapText(400,300,'countFont','0', 120)
                .setOrigin(0.5);
            this.fontReady = true;
        },
        // Optional parameter. Contains the callback onProgress (really wouldn't be necessary for so few glyphs). 
        options);

        // Adds a task to make a bitmapfont using the firs available monospace in the browser and 
        // generating only glyphs for numbers. In this case, we don't need kernings. The generated
        // bitmapfont will be saved in bitmapfonts cache as "countFont".
        bmff.make('countFont', bmff.defaultFonts.monospace, '0123456789', {fontSize: '120px'}, false);

        // Executes the previously defined tasks. When finished, it calls the callback.
        bmff.exec();
    }

    update(){
        if(fontReady){
            this.count++;
            this.counterBMF.setText(this.count);
        }
    }
}
```
  
  


---
## License
**Phaser3 Bitmapfont Factory** is licensed under the terms of the MIT open source license.

