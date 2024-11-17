type Kerning = {
    first: number,
    second: number,
    amount: number
}

type Options = {
    // The size of the generated texture will be power of two?
    PoT: boolean,
    onProgress?: (progress: number) => void
}

type Glyph = {
    id: number,
    letter: string,
    printX: number,
    printY: number,
    xmlX: number,
    xmlY: number,
    xmlXoffset: number,
    xmlYoffset: number,
    xmlWidth: number,
    xmlHeight: number,
    xmlXadvance: number
}

type Task = {
    chars: string,
    fontFamily: string,
    getKernings: boolean,
    glyphs: Glyph[],
    kernings: Kerning[],
    key: string,
    style: Phaser.GameObjects.TextStyle
}

export { Options, Task }