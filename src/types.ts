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

type Task = {
    chars: string,
    fontFamily: string,
    fontHeight: number,
    fontWidths: number[],
    glyps: Phaser.GameObjects.Text[],
    key: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    textureHeight: number,
    textureWidth: number
}

export { FontData, BmfConfig, Task }