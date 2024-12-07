import { kerningPairs, serif, sansSerif, monospace } from './constants.js';
import { makeTexture } from './maketexture.js';
import { makeXMLs } from './makexml';
import { Cache, Glyph, Options, Task } from './types';
import ParseXMLBitmapFont from '../node_modules/phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js';

export default class BMFFactory {

    onProgress: (n: number) => void;
    PoT: boolean = false;
    scene: Phaser.Scene;
    disableCache: boolean = false;

    // Common and browser default fonts grouped in arrays by type, to use with make() method.
    defaultFonts = {
        sansSerif: sansSerif,
        serif: serif,
        monospace: monospace
    }

    #ctx: CanvasRenderingContext2D;
    #currentPendingSteps: number = 0;
    #currentTexture: Phaser.Textures.Texture = null;
    #currentXMLs: Document[] = [];
    #currentHash: string;
    #isOnCache: boolean = false;
    #onComplete: () => void = () => { };
    #padding: number = 1;
    #tasks: Task[] = [];
    #textureWidth: number = 0;
    #textureHeight: number = 0;
    #totalGlyphs: number = 0;
    #totalHeight: number = 0;
    #totalProgress: number = 0;
    #totalWidth: number = 0;

    /**
     * Creates an instance of the class BMFFactory. This class allows you to create a bitmapFont
     * from one of the fonts loaded in the browser, and add it to the Phaser cache of bitmapFonts.
     * @param scene A reference to the Phaser.Scene
     * @param onComplete Function that will be called when all tasks are completed.
     * @param [options]
     * @param [options.PoT = false] The size of generated texture will be power of two?. Default: false. 
     * @param [options.disableCache = false] Disables the cache when true. By default, the calculations 
     * generated in the first run are stored in the localStorage for reuse in subsequent runs.
     * @param [options.onProgress] Callback function executed two times per font. Receives a number between 
     * 0 and 1 (total progress).
     */
    constructor(scene: Phaser.Scene, onComplete: () => void, options: Options = { PoT: false, disableCache: false }) {
        this.scene = scene;
        this.PoT = options.PoT;
        this.disableCache = options.disableCache;
        this.onProgress = options.onProgress;
        this.#onComplete = onComplete;
        this.#ctx = document.createElement('canvas').getContext('2d');
    }

    /**
     * Checks if a font is availble to use.
     * @param fontFamily Name of the font
     * @returns True if font is available
     */
    check(fontFamily: string): boolean {
        const ctx = this.#ctx;
        ctx.font = "12px default";
        const m1 = ctx.measureText("0");
        ctx.font = '12px ' + fontFamily;
        const m2 = ctx.measureText("0");

        return (m1.actualBoundingBoxAscent != m2.actualBoundingBoxAscent && m1.actualBoundingBoxRight != m2.actualBoundingBoxRight);//document.fonts.check('12px ' + fontFamily);
    }

    /**
     * Executes the tasks stored in the task queue. When all tasks have been completed, it calls
     * the onComplete callback.
     * @returns void
     */
    async exec() {

        this.#totalGlyphs = 0;
        this.#totalHeight = 0;
        this.#totalWidth = 0;

        if (!this.disableCache) {
            // Cache. Handles posible localStorage SecurityError.
            const tasksHash = this.#hash(JSON.stringify(this.#tasks));
            try {
                const data = localStorage.getItem(tasksHash);
                this.#currentHash = tasksHash;
                if (data) {
                    const cache: Cache = JSON.parse(data);
                    this.#tasks = cache.tasks;
                    this.#textureWidth = cache.textureW;
                    this.#textureHeight = cache.textureH;
                    this.#isOnCache = true;
                }
            } catch {
                this.disableCache = true;
            }
        }

        if (this.#textureWidth == 0) {
            // Make glyphs
            await this.#makeGlyphs();

            // Set texture dimensions
            this.#calcBounds();

            // Calc kernings
            await this.#calcKernings();
        }

        this.#currentPendingSteps = 2;
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
     * Only *fontSize*, *color* and *fontStyle* properties are used.
     * @param [getKernings = true] You are going to use the kernings?. Not using kernings reduces the generation time.
     */
    make(key: string,
        fontFamily: string | string[],
        chars: string,
        style: Phaser.Types.GameObjects.Text.TextStyle,
        getKernings: boolean = true) {

        if (style.fontSize == undefined) {
            style.fontSize = '32px';
        }

        let _fontFamily = '';

        if (typeof fontFamily == 'string') {
            _fontFamily = fontFamily;
        } else {
            _fontFamily = this.#getValidFont(fontFamily);
        }

        let _font = '';
        _font += style.fontStyle ? `${style.fontStyle} ` : '';
        _font += `${style.fontSize} `;
        _font += `"${_fontFamily}"`;

        const task: Task = {
            chars: chars,
            font: _font,
            fontFamily: _fontFamily,
            glyphs: [],
            getKernings: getKernings,
            kernings: [],
            key: key,
            style: style
        }

        task.style.fontFamily = task.fontFamily;

        this.#tasks.push(task);
    }// End make()

    #calcBounds = () => {
        const tasks = this.#tasks;
        let textureWidth = 0;
        let textureHeight = 0;
        let rowY = this.#padding;
        let rowX = this.#padding;

        textureWidth = this.#getTextureWidth(this.#totalGlyphs, this.#totalHeight, this.#totalWidth);

        // Joins all glyphs in same array for convenience
        const glyphs: Glyph[] = [];
        for (let i = 0; i < tasks.length; i++) {
            glyphs.push(...tasks[i].glyphs);
        }

        // Sets positions of glyphs in 2d space
        glyphs.sort((a, b) => b.xmlHeight - a.xmlHeight);
        let last = glyphs[0];
        let rowHeight = last.xmlHeight + this.#padding;
        glyphs.forEach(glyph => {
            glyph.xmlX = rowX;
            glyph.xmlY = rowY;
            rowX = glyph.xmlX + glyph.xmlWidth + this.#padding;
            if (rowX > textureWidth) {
                glyph.xmlX = this.#padding;
                glyph.xmlY = rowHeight + rowY;
                last = glyph;
                rowX = glyph.xmlX + glyph.xmlWidth + this.#padding;
                rowY += rowHeight;
                rowHeight = glyph.xmlHeight + this.#padding;
            }
            // Position for fillText()
            glyph.printX = glyph.xmlX + glyph.actualBoundingBoxLeft;
            glyph.printY = glyph.xmlY + glyph.actualBoundingBoxAscent;
        });

        // Sets definitive values for texture size
        textureHeight = last.xmlY + last.xmlHeight + this.#padding;

        if (this.PoT) {
            textureHeight = Phaser.Math.Pow2.GetNext(textureHeight);
        }

        this.#textureWidth = textureWidth;
        this.#textureHeight = textureHeight;
    }

    #calcKernings = async () => {
        const tasks = this.#tasks;
        const ctx = this.#ctx;

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (!task.getKernings) {
                continue;
            }

            const kernings = task.kernings;
            const chars = task.chars;
            const glyphs = task.glyphs;
            const pairs = this.#getKerningPairs(task);
            ctx.font = task.font;

            for (let j = 0; j < pairs.length; j++) {

                const pair = pairs[j];
                const p1 = glyphs[chars.indexOf(pair[0])];
                const p2 = glyphs[chars.indexOf(pair[1])];
                const w1 = p1.xmlWidth + p2.xmlWidth;
                const metricsPair = ctx.measureText(pairs[j])
                const w2 = metricsPair.actualBoundingBoxRight + metricsPair.actualBoundingBoxLeft;
                const offset = Math.ceil(w2 - w1);
                if (offset != 0) {
                    kernings.push({ first: p1.id, second: p2.id, amount: offset });
                }
            }

            if (this.onProgress) {
                this.#totalProgress += (1 / 2) * (1 / this.#tasks.length);
                let t = this;
                await new Promise((resolve) => {
                    t.onProgress(t.#totalProgress);
                    t.scene.events.once('preupdate', resolve);
                });
            }
        }// end for

    }

    #finish = () => {
        const texture = this.#currentTexture;
        const xmls = this.#currentXMLs;
        const textureKey = this.#tasks[0].key;
        const frame = this.scene.textures.getFrame(textureKey);

        for (let i = 0; i < xmls.length; i++) {
            const xml = xmls[i];
            const fontData = ParseXMLBitmapFont(xml, frame, 0, 0, texture);
            this.scene.cache.bitmapFont.add(this.#tasks[i].key, { data: fontData, texture: textureKey, frame: null });
        }

        if (!this.#isOnCache && !this.disableCache) {
            const cache: Cache = {
                tasks: this.#tasks,
                textureW: this.#textureWidth,
                textureH: this.#textureHeight
            }
            localStorage.setItem(this.#currentHash, JSON.stringify(cache));
        }


        this.#currentTexture = null;
        this.#currentXMLs = [];
        this.#tasks = [];

        this.#onComplete();
    }

    #getKerningPairs = (task: Task): string[] => {
        const pairs = [];
        for (let i = 0; i < kerningPairs.length; i++) {
            const pair = kerningPairs[i];
            if (task.chars.indexOf(pair[0]) != -1 && task.chars.indexOf(pair[1]) != -1) {
                pairs.push(kerningPairs[i]);
            }
        }
        return pairs;
    }

    #getTextureWidth = (totalGlyphs: number, totalHeight: number, totalWidth: number): number => {
        const avgHeight = totalHeight / totalGlyphs;
        const avgWidth = totalWidth / totalGlyphs;
        const avg = Math.max(avgHeight, avgWidth);
        const surface = avg * avg * totalGlyphs; // px^2
        let textureWidth = Math.ceil(Math.sqrt(surface));

        if (this.PoT) {
            return textureWidth = Phaser.Math.Pow2.GetNext(textureWidth);
        }

        return textureWidth + 2 * this.#padding;
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

    // https://en.wikipedia.org/wiki/Fowler-Noll-Vo_hash_function
    #hash = (str: string): string => {
        let hash = 0x811c9dc5; // Offset basis
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = (hash * 0x01000193) >>> 0; // FNV prime
        }
        return hash.toString();
    }

    #makeGlyphs = async () => {
        const tasks = this.#tasks;
        const ctx = this.#ctx;

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const chars = task.chars;
            const count = chars.length;
            this.#totalGlyphs += count;
            ctx.font = task.font;

            for (let j = 0; j < count; j++) {
                const char = chars[j];
                const glyph: Glyph = {
                    actualBoundingBoxAscent: 0,
                    actualBoundingBoxLeft: 0,
                    id: char.charCodeAt(0),
                    letter: char,
                    printX: 0,
                    printY: 0,
                    xmlX: 0,
                    xmlY: 0,
                    xmlXoffset: 0,
                    xmlYoffset: 0,
                    xmlHeight: 0,
                    xmlWidth: 0,
                    xmlXadvance: 0
                }

                const metrics = ctx.measureText(char);
                glyph.xmlXoffset = -metrics.actualBoundingBoxLeft;
                glyph.xmlYoffset = metrics.actualBoundingBoxDescent;
                glyph.xmlWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
                glyph.xmlHeight = metrics.actualBoundingBoxDescent + metrics.actualBoundingBoxAscent;
                glyph.xmlXadvance = metrics.width;

                // Used later to calc print positions
                glyph.actualBoundingBoxAscent = metrics.actualBoundingBoxAscent;
                glyph.actualBoundingBoxLeft = metrics.actualBoundingBoxLeft;

                task.glyphs.push(glyph);

                // Used to calc texture size
                this.#totalHeight += glyph.xmlHeight + this.#padding;
                this.#totalWidth += glyph.xmlWidth + this.#padding;
            }

            if (this.onProgress) {
                this.#totalProgress += (1 / 2) * (1 / this.#tasks.length);
                let t = this;
                await new Promise((resolve) => {
                    t.onProgress(t.#totalProgress);
                    t.scene.events.once('preupdate', resolve);
                });
            }
        }
    }

    #makeTexture = async () => {
        this.#currentTexture = await makeTexture(this.scene, this.#tasks, this.#textureWidth, this.#textureHeight);
        this.#step(null);
    }

    #makeXMLs = async () => {
        this.#currentXMLs = makeXMLs(this.#tasks);
        this.#step(null);
    }

    #step = (task: Task) => {
        this.#currentPendingSteps -= 1;
        if (this.#currentPendingSteps == 0) {
            this.#finish();
        }
    }

}
