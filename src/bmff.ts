import { kerningPairs, serif, sansSerif, monospace } from './constants.js';
import { makeTexture } from './maketexture.js';
import { makeXMLs } from './makexml';
import { Task } from './types';
import ParseXMLBitmapFont from '../node_modules/phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js';

export default class BMFFactory {

    currentPendingSteps: number = 0;
    currentTexture: Phaser.Textures.Texture = null;
    currentXMLs: Document[] = [];
    maxTextureSize: number = 2048;
    onComplete: () => void = () => { };
    scene: Phaser.Scene;
    tasks: Task[] = [];

    // Common and browser default fonts grouped in arrays by type, to use with make() method.
    defaultFonts = {
        sansSerif: sansSerif,
        serif: serif,
        monospace: monospace
    }

    #textureWidth: number = 0;
    #textureHeight: number = 0;

    #totalGlyphs: number = 0;
    #totalHeight: number = 0;
    #totalWidth: number = 0;

    /**
     * Creates an instance of the class BMFFactory. This class allows you to create a bitmapFont
     * from one of the fonts loaded in the browser, and add it to the Phaser cache of bitmapFonts.
     * @param scene A reference to the Phaser.Scene
     * @param onComplete Function that will be called when all tasks are completed.
     */
    constructor(scene: Phaser.Scene, onComplete: () => void) {
        this.scene = scene;
        this.onComplete = onComplete;
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
        
        this.#totalGlyphs = 0;
        this.#totalHeight = 0;
        this.#totalWidth = 0;

        // Make glyphs
        this.#makeGlyphs();

        // Set texture dimensions
        this.#calcBounds();

        // Calc kernings
        this.#calcKernings();

        this.currentPendingSteps = 2;
        this.#makeTexture(); // async
        this.#makeXMLs();
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
            glyphsBounds: [],
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

    #calcBounds = () => {
        const tasks = this.tasks;
        let textureWidth = 0;
        let textureHeight = 0;
        let rowHeight = 0;
        let rowWidth = 0;
        let x = 0;
        let y = 0;

        textureWidth = this.#getTextureWidth(this.#totalGlyphs, this.#totalHeight, this.#totalWidth);

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const glyphs = task.glyphs;
            const gBounds = task.glyphsBounds;
            let glyphHeight = glyphs[0].height;

            if (glyphHeight > rowHeight) {
                rowHeight = glyphHeight;
            }

            for (let j = 0; j < glyphs.length; j++) {
                let glyph = glyphs[j];
                rowWidth += glyph.width;

                if (rowWidth > textureWidth) {
                    rowWidth = glyph.width;
                    y += rowHeight;
                    rowHeight = glyphHeight;
                    x = 0;
                }

                gBounds[j] = { x: x, y: y, w: glyph.width, h: glyph.height };
                textureHeight = y + glyph.height;
                x += glyph.width;
            } // end for
        }// end for

        this.#textureWidth = textureWidth;
        this.#textureHeight = textureHeight;
        console.log(textureWidth, textureHeight);

    }

    #calcKernings = () => {
        const tasks = this.tasks;

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (!task.getKernings) {
                continue;
            }

            const kernings = task.kernings;
            const chars = task.chars;
            const bounds = task.glyphsBounds;
            const pairs = this.#getKerningPairs(task);

            for (let j = 0; j < pairs.length; j++) {

                const pair = pairs[j].split('');

                const w1 = bounds[chars.indexOf(pair[0])].w + bounds[chars.indexOf(pair[1])].w;

                const pairGlyph = this.scene.make.text({ text: pairs[j], style: task.style }, false);

                const w2 = pairGlyph.width;

                const offset = w2 - w1;

                if (offset != 0) {
                    kernings.push({ first: pairs[j].charCodeAt(0), second: pairs[j].charCodeAt(1), amount: offset });
                }

                pairGlyph.destroy();
            }// end for
        }// end for

    }

    #ceilPowerOfTwo = (n: number): number => {
        // Checks power of two (in binary is 1[...0], so 10000 ^ 10001 == 1)
        if ((n ^ (n + 1)) != 1) {
            // 10011 << 1 ; 100110 & (1 << 5) ; 100000 (upper power of two)
            n = (n << 1) & (1 << (n.toString(2).length));
        }
        return n;
    }

    #finish = () => {
        const texture = this.currentTexture;
        const xmls = this.currentXMLs;
        const textureKey = this.tasks[0].key;

        for (let i = 0; i < xmls.length; i++) {
            const xml = xmls[i];
            const frame = this.scene.textures.getFrame(textureKey);
            const fontData = ParseXMLBitmapFont(xml, frame, 0, 0, texture);

            this.scene.cache.bitmapFont.add(this.tasks[i].key, { data: fontData, texture: textureKey, frame: null });
        }

        this.onComplete();
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

    #getTextureWidth = (totalGlyphs: number, totalHeight: number, totalWidth: number): number => {
        const avgHeight = totalHeight / totalGlyphs;
        const avgWidth = totalWidth / totalGlyphs;
        const surface = avgWidth * avgHeight * totalGlyphs; // px^2
        let textureWidth = Math.ceil(Math.sqrt(surface));
        return textureWidth;
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

    #makeGlyphs = () => {
        const tasks = this.tasks;
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const chars = task.chars;
            const count = chars.length;

            this.#totalGlyphs += count;

            for (let j = 0; j < count; j++) {
                const char = chars[j];
                let glyp = this.scene.make.text({ text: char, style: task.style }, false);
                task.glyphs.push(glyp);
                // Used to calc of texture size
                this.#totalHeight += glyp.height;
                this.#totalWidth += glyp.width;
            }
        }
    }

    #makeTexture = async () => {
        this.currentTexture = await makeTexture(this.scene, this.tasks, this.#textureWidth, this.#textureHeight);
        this.#step(null);
    }

    #makeXMLs = async () => {
        this.currentXMLs = makeXMLs(this.tasks);
        this.#step(null);
    }

    #step = (task: Task) => {
        this.currentPendingSteps -= 1;
        if (this.currentPendingSteps == 0) {
            this.#finish();
        }
    }

}
