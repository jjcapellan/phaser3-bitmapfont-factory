type Kerning = {
    first: number,
    second: number,
    amount: number
}

type Task = {
    chars: string,
    fontFamily: string,
    fontHeight: number,
    fontWidths: number[],
    getKernings: boolean,
    glyphs: Phaser.GameObjects.Text[],
    glyphsBounds: { x: number, y: number, w: number, h: number }[],
    kernings: Kerning[],
    key: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    textureHeight: number,
    textureWidth: number
}

export { Task }