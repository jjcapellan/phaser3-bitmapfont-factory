/// <reference types="./phaser" />
type Kerning = {
    first: number;
    second: number;
    amount: number;
};
type Options = {
    disableCache: boolean;
    PoT: boolean;
    onProgress?: (progress: number) => void;
};
type Glyph = {
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
type Task = {
    chars: string;
    font: string;
    fontFamily: string;
    getKernings: boolean;
    glyphs: Glyph[];
    kernings: Kerning[];
    key: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
};
type Cache = {
    tasks: Task[];
    textureW: number;
    textureH: number;
};
export { Cache, Glyph, Options, Task };
