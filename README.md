# Phaser3 Bitmapfont Factory
This Phaser3 class creates bitmapfonts at runtime, using available browser fonts.  
This class resolves two problems:
1) You need to replace Phaser text with bitmapfonts to gain performance.
2) You don't want to save the same bitmapfont in several sizes for each screen resolution.

## Quick example
```javascript
// Which characters do you need?. Don't forget the space character.
let chars = ' ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789".,';


// constructor(scene, onComplete)
// Creates an object of the class BMFFactory
// The constructor has two arguments: the Phaser scene and a callback function. The callback is called when
// when the new bitmapfonts are created an added to the Phaser cache.
let bmff = new BMFFactory(this, () => {
            this.scene.start('menu');
        });


// BMFFactory.make(key, fontFamily, chars, style, getKernings) 
// Creates a task to make a bitmapfont, and adds it to the queue. 
// The commands will not be executed until we call the exec() method.
bmff.make('arial_bmf', 'Arial', chars, { fontSize: '84px', color: '#555568' }, true);


// Executes the tasks stored in the task queue. When all tasks have been completed, it calls
// the onComplete callback. (async function)
bmf.exec();

```