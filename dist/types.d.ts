declare type Kerning = {
    first: number;
    second: number;
    amount: number;
};
declare type Options = {
    PoT: boolean;
    onProgress?: (progress: number) => void;
};
declare type Glyph = {
    actualBoundingBoxAscent: number;
    actualBoundingBoxLeft: number;
    id: number;
    letter: string;
    printX: number;
    printY: number;
    xmlX: number;
    xmlY: number;
    xmlXoffset: number;
    xmlYoffset: number;
    xmlWidth: number;
    xmlHeight: number;
    xmlXadvance: number;
};
declare type Task = {
    chars: string;
    font: string;
    fontFamily: string;
    getKernings: boolean;
    glyphs: Glyph[];
    kernings: Kerning[];
    key: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
};
export { Glyph, Options, Task };
