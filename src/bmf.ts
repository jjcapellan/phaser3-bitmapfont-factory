/// <reference path="../types/phaser.d.ts" />

import ParseXMLBitmapFont from '../node_modules/phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js';
import { rtSnapshot } from './snapshot';

let BMFMaker = {
    loadText: async (
        scene: Phaser.Scene,
        charset: string,
        fontName: string = 'Arial',
        textStyle: Phaser.Types.GameObjects.Text.TextStyle = {},
        callback: () => void) => {

        textStyle.fontFamily = fontName;
        if (!textStyle.fontSize) {
            textStyle.fontSize = '12px';
        }

        let c: BmfConfig = {
            scene: scene,
            charset: charset,
            fontName: fontName,
            textStyle: textStyle
        }

        c.texture = await makeBMFTexture(c);

        c.frame = scene.textures.getFrame(fontName);

        c.xml = makeBMFXml(c);

        c.fontData = ParseXMLBitmapFont(c.xml, c.frame, 0, 0, c.texture);

        scene.cache.bitmapFont.add(fontName, { data: c.fontData, texture: fontName, frame: null });

        callback();
    }
}

const makeBMFTexture = async (bmfConfig: BmfConfig): Promise<Phaser.Textures.Texture> => {
    let c = bmfConfig;

    const widths: number[] = [];
    const charsTxt: Phaser.GameObjects.Text[] = [];
    let rtWidth = 0;
    for (let i = 0; i < c.charset.length; i++) {
        const char = c.charset[i];
        const txt: Phaser.GameObjects.Text = c.scene.add.text(0, 0, char, c.textStyle);
        //txt.setOrigin(0);
        const b = txt.getBounds();
        widths.push(b.width);
        charsTxt.push(txt);
        rtWidth += b.width;

    }


    const rtHeight = charsTxt[0].getBounds().height;
    const rt: Phaser.GameObjects.RenderTexture = c.scene.make.renderTexture({ x: 0, y: 0, width: rtWidth, height: rtHeight, }, false);//c.scene.add.renderTexture(0, 0, rtWidth, rtHeight);

    rt.setOrigin(0);


    let xPos = 0;
    for (let i = 0; i < charsTxt.length; i++) {
        rt.draw(charsTxt[i], xPos, 0);
        xPos += widths[i];
    }

    // Converts renderTexture to Phaser.texture
    // (Using a renderTexture.saveTexture() in next steps produces an inverted text) 
    function rtToTexture(): Promise<Phaser.Textures.Texture> {
        return new Promise(resolve => {
            rtSnapshot(rt, c.scene.renderer,
                (img: any) => {
                    c.scene.textures.addImage(c.fontName, img);
                    let texture = c.scene.textures.get(c.fontName);
                    rt.destroy();
                    resolve(texture);
                });
        })
    }

    return rtToTexture();
}

const makeBMFXml = (bmfConfig: BmfConfig): Document => {
    let c = bmfConfig;
    const size = c.textStyle.fontSize.replace('px', '');
    const xmlHeader: string = '<?xml version="1.0"?><font><info face="' + c.fontName +
        '" size="' + size +
        '"></info><common lineHeight="' + size +
        '"></common><chars count="' + c.charset.length +
        '"></chars>';

    let xPos = 0;
    let xmlBody: string = '';

    // fills xmlBody
    for (let i = 0; i < c.charset.length; i++) {
        const id = c.charset[i].charCodeAt(0);
        const char = c.scene.add.text(0, 0, c.charset[i], c.textStyle);
        const b = char.getBounds();

        // Chars are destroyed by the scene manager
        char.setVisible(false);
        const str = `<char id="${id}" x="${xPos}" y="0" width="${b.width}" height="${b.height}"` +
            ` xoffset="0" yoffset="0" xadvance="${b.width}"/>`;

        xPos += b.width;
        xmlBody += str;
    }

    const xmlFooter = '</font>';

    const xmlString = xmlHeader + xmlBody + xmlFooter;

    // Converts xmlString into html element
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');

    return xml;
}

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



export { BMFMaker }