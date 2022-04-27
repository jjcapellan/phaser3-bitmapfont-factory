import { Options } from './types';
export default class BMFFactory {
    #private;
    onProgress: (n: number) => void;
    PoT: boolean;
    scene: Phaser.Scene;
    defaultFonts: {
        sansSerif: string[];
        serif: string[];
        monospace: string[];
    };
    /**
     * Creates an instance of the class BMFFactory. This class allows you to create a bitmapFont
     * from one of the fonts loaded in the browser, and add it to the Phaser cache of bitmapFonts.
     * @param scene A reference to the Phaser.Scene
     * @param onComplete Function that will be called when all tasks are completed.
     * @param [options]
     * @param [options.PoT = false] The size of generated texture will be power of two?. Default: false.
     * @param [options.onProgress] Callback function executed two times per font. Receives a number between
     * 0 and 1 (total progress). This option will be necessary if you want to draw something on the screen
     * during the generation process, since it uses the Phaser rendering context.
     */
    constructor(scene: Phaser.Scene, onComplete: () => void, options?: Options);
    /**
     * Checks if a font is availble to use.
     * @param fontFamily Name of the font
     * @returns True if font is available
     */
    check(fontFamily: string): boolean;
    /**
     * Executes the tasks stored in the task queue. When all tasks have been completed, it calls
     * the onComplete callback.
     * @returns void
     */
    exec(): Promise<void>;
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
     * @param [getKernings = true] You are going to use the kernings?. Not using kernings reduces the generation time.
     */
    make(key: string, fontFamily: string | string[], chars: string, style?: Phaser.Types.GameObjects.Text.TextStyle, getKernings?: boolean): void;
}
