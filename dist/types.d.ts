declare type Kerning = {
    first: number;
    second: number;
    amount: number;
};
declare type Options = {
    PoT: boolean;
};
declare type Task = {
    chars: string;
    fontFamily: string;
    getKernings: boolean;
    glyphs: Phaser.GameObjects.Text[];
    glyphsBounds: {
        x: number;
        y: number;
        w: number;
        h: number;
    }[];
    kernings: Kerning[];
    key: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
};
export { Options, Task };
