/// <reference path="../types/phaser.d.ts" />
declare let BMFMaker: {
    loadText: (scene: Phaser.Scene, charset: string, fontName: string, textStyle: Phaser.Types.GameObjects.Text.TextStyle, callback: () => void) => Promise<void>;
};
export { BMFMaker };
