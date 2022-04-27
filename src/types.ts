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

type Task = {
    chars: string,
    fontFamily: string,
    getKernings: boolean,
    glyphs: Phaser.GameObjects.Text[],
    glyphsBounds: { x: number, y: number, w: number, h: number }[],
    kernings: Kerning[],
    key: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
}

export { Options, Task }