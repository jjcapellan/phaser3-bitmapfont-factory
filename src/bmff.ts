import ParseXMLBitmapFont from '../node_modules/phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js';
import { kerningPairs, serif, sansSerif, monospace } from './constants.js';
import { makeTexture } from './maketexture.js';
import { makeXML } from './makexml';
import { Task } from './types';

export default class BMFFactory {

    scene: Phaser.Scene;
    tasks: Task[];
    isIdle: boolean;
    maxTextureSize: number;
    powerOfTwo: boolean;
    currentXML: Document;
    currentTexture: Phaser.Textures.Texture;
    currentPendingSteps: number;
    onComplete: () => void;

    // Common and browser default fonts grouped in arrays by type, to use with make() method.
    defaultFonts = {
        sansSerif: sansSerif,
        serif: serif,
        monospace: monospace
    }


    #onProgress: (progress: number) => void = (n) => { };
    // Number of tasks when exec() is called first time.
    #totalTasks: number = 0;
    // Number between 0 and 1. Progress of current task queue.
    #progress: number = 0;

    /**
     * Creates an instance of the class BMFFactory. This class allows you to create a bitmapFont
     * from one of the fonts loaded in the browser, and add it to the Phaser cache of bitmapFonts.
     * @param scene A reference to the Phaser.Scene
     * @param onComplete Function that will be called when all tasks are completed.
     */
    constructor(scene: Phaser.Scene, onComplete: () => void) {
        this.scene = scene;
        this.onComplete = onComplete;
        this.tasks = [];
        this.isIdle = true;
        this.maxTextureSize = 2048;
        this.powerOfTwo = true;
        this.currentXML = null;
        this.currentTexture = null;
        this.currentPendingSteps = 0;
    }

    /**
     * Checks if a font is availble to use.
     * @param fontFamily Name of the font
     * @returns True if font is available
     */
    check(fontFamily: string): boolean {
        return document.fonts.check('12px ' + fontFamily);
    }

    /**
     * Executes the tasks stored in the task queue. When all tasks have been completed, it calls
     * the onComplete callback.
     * @returns void
     */
    exec() {
        if (this.#totalTasks == 0) {
            this.#totalTasks = this.tasks.length;
        }

        const task = this.tasks.pop();
        if (task == undefined) {
            this.#totalTasks = 0;
            this.#progress = 0;
            this.onComplete();
            return;
        }


        // Make glyphs
        this.#makeGlyphs(task);
        this.#setProgress(0.25);

        // Set texture dimensions
        this.#setDimensions(task);

        // Calc kernings
        if (task.getKernings) {
            this.#calcKernings(task);
        }
        this.#setProgress(0.25);

        this.currentPendingSteps = 2;
        this.#makeTexture(task); // async
        this.#makeXML(task);
    }

    /**
     * Creates a task to make a bitmapfont, and adds it to the queue. The commands will not be executed 
     * until we call the exec() function.
     * @param key The key to be used in Phaser cache
     * @param fontFamily The name of any font already loaded in the browser (e.g., "Arial", "Verdana", ...), or 
     * an array of names (first valid font will be selected).
     * @param chars String containing the characters to use (e.g., " abcABC123/*%,."). Important: You must 
     * include the space character (" ") if you are going to use it.
     * @param style The text style configuration object (the same as the one used in Phaser.GameObjects.Text).
     * FontName and FontFamily properties of this object are ignored.
     * @param getKernings You are going to use the kernings?. Not using kernings reduces the generation time.
     */
    make(key: string, fontFamily: string | string[], chars: string, style: Phaser.Types.GameObjects.Text.TextStyle = {}, getKernings: boolean) {

        if (style.fontSize == undefined) {
            style.fontSize = '32px';
        }

        let _fontFamily = '';

        if (typeof fontFamily == 'string') {
            _fontFamily = fontFamily;
        } else {
            _fontFamily = this.#getValidFont(fontFamily);
        }

        const task: Task = {
            chars: chars,
            fontFamily: _fontFamily,
            fontHeight: 0,
            fontWidths: [],
            glyphs: [],
            getKernings: getKernings,
            kernings: [],
            key: key,
            style: style,
            textureHeight: 0,
            textureWidth: 0
        }

        task.style.fontFamily = task.fontFamily;


        this.tasks.push(task);
    }// End make()

    setOnProgress(callback: (progress: number) => void) {
        this.#onProgress = callback;
    }

    #calcKernings = (task: Task) => {
        const kernings = task.kernings;
        const chars = task.chars;
        const widths = task.fontWidths;
        const pairs = this.#getKerningPairs(task);

        for (let i = 0; i < pairs.length; i++) {

            const pair = pairs[i].split('');

            const w1 = widths[chars.indexOf(pair[0])] + widths[chars.indexOf(pair[1])];

            const pairGlyph = this.scene.make.text({ text: pairs[i], style: task.style }, false);

            const w2 = pairGlyph.width;

            const offset = w2 - w1;

            if (offset != 0) {
                kernings.push({ first: pairs[i].charCodeAt(0), second: pairs[i].charCodeAt(1), amount: offset });
            }

            pairGlyph.destroy();
        }

    }




    #ceilPowerOfTwo = (n: number): number => {
        // Checks power of two (in binary is 1[...0], so 10000 ^ 10001 == 1)
        if ((n ^ (n + 1)) != 1) {
            // 10011 << 1 ; 100110 & (1 << 5) ; 100000 (upper power of two)
            n = (n << 1) & (1 << (n.toString(2).length));
        }
        return n;
    }

    #finish = (key: string) => {
        const texture = this.currentTexture;
        const xml = this.currentXML;
        const frame = this.scene.textures.getFrame(key);
        const fontData = ParseXMLBitmapFont(xml, frame, 0, 0, texture);

        this.scene.cache.bitmapFont.add(key, { data: fontData, texture: key, frame: null });

        // Executes next task
        this.exec();
    }

    #getValidFont = (fonts: string[]): string => {
        let font = '';
        for (let i = 0; i < fonts.length; i++) {
            if (this.check(fonts[i])) {
                font = fonts[i];
                break;
            }
        }
        return font;
    }

    #makeGlyphs = (task: Task) => {
        const chars = task.chars;
        const count = chars.length;

        for (let i = 0; i < count; i++) {
            const char = chars[i];
            let glyp = this.scene.make.text({ text: char, style: task.style }, false);
            task.glyphs.push(glyp);
        }
    }

    #makeTexture = async (task: Task) => {
        this.currentTexture = await makeTexture(this.scene, task);
        this.#setProgress(0.25);
        this.#step(task);
    }

    #makeXML = (task: Task) => {
        this.currentXML = makeXML(task);
        this.#setProgress(0.25);
        this.#step(task);
    }

    #getKerningPairs = (task: Task): string[] => {
        const pairs = [];
        for (let i = 0; i < kerningPairs.length; i++) {
            const pair = kerningPairs[i].split('');
            if (task.chars.indexOf(pair[0]) != -1 && task.chars.indexOf(pair[1]) != -1) {
                pairs.push(kerningPairs[i]);
            }
        }
        return pairs;
    }

    #setProgress = (current: number) => {
        this.#progress += (current * 1) / this.#totalTasks;
        this.#onProgress(Math.round(this.#progress * 100) / 100);
    }

    #step = (task: Task) => {
        this.currentPendingSteps -= 1;
        if (this.currentPendingSteps == 0) {
            this.#finish(task.key);
        }
    }

    #setDimensions = (task: Task) => {
        const glyphs = task.glyphs;
        const count = glyphs.length;
        let maxCharWidth = 0;
        let textureWidth = 0;
        let textureHeight = 0;

        // Gets char widths
        for (let i = 0; i < count; i++) {
            let width = glyphs[i].getBounds().width;
            task.fontWidths.push(width);
            textureWidth += width;
            if (width > maxCharWidth) {
                maxCharWidth = width;
            }
        }

        // Chars height
        task.fontHeight = glyphs[0].getBounds().height;
        textureHeight = task.fontHeight;

        // Apply size limits
        if (textureWidth > this.maxTextureSize) {
            textureHeight *= Math.ceil(textureWidth / this.maxTextureSize);
            textureWidth = this.maxTextureSize;
        }

        // Snaps to power of two
        textureWidth = this.#ceilPowerOfTwo(textureWidth);
        textureHeight = this.#ceilPowerOfTwo(textureHeight);

        task.textureWidth = textureWidth;
        task.textureHeight = textureHeight;

    }


}
