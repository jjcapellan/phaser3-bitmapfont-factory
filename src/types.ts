type FontData = {
    font?: string,
    size?: number,
    lineHeight?: number,
    chars?: Phaser.Types.GameObjects.BitmapText.BitmapFontCharacterData[] | {}
}


type BmfConfig = {
    scene: Phaser.Scene,
    charset: string,
    fontName: string,
    textStyle: Phaser.Types.GameObjects.Text.TextStyle,
    frame?: Phaser.Textures.Frame,
    texture?: Phaser.Textures.Texture,
    xml?: Document,
    fontData?: FontData
}

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

export { FontData, BmfConfig, Task }