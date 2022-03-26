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

export { FontData, BmfConfig }