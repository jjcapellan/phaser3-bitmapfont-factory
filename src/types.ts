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
    glyps: Phaser.GameObjects.Text[],
    kernings: Kerning[],
    key: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    textureHeight: number,
    textureWidth: number
}

export { Task }