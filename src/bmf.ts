/// <reference path="../types/phaser.d.ts" />

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

        c.fontData = ParseXMLBitmapFont(c.xml, c.frame, c.texture);

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
    // (Using a renderTexture in next steps produces an inverted text) 
    function rtToTexture(): Promise<Phaser.Textures.Texture> {
        return new Promise(resolve => {
            rt.snapshot((img: any) => {
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
        // Code ascii
        const id = c.charset[i].charCodeAt(0);
        // Using make.text produces different bounds
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


function getValue(node, attribute) {
    return parseInt(node.getAttribute(attribute), 10);
}

// This function is a reduced version from:
// https://github.com/photonstorm/phaser/blob/v3.51.0/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js
var ParseXMLBitmapFont = function (xml: Document, frame: Phaser.Textures.Frame, texture: Phaser.Textures.Texture) {

    const xSpacing = 0;
    const ySpacing = 0;

    var textureX = frame.cutX;
    var textureY = frame.cutY;
    var textureWidth = frame.source.width;
    var textureHeight = frame.source.height;
    var sourceIndex = frame.sourceIndex;


    var data: FontData = {};
    var info = xml.getElementsByTagName('info')[0];
    var common = xml.getElementsByTagName('common')[0];

    data.font = info.getAttribute('face');
    data.size = getValue(info, 'size');
    data.lineHeight = getValue(common, 'lineHeight') + ySpacing;
    data.chars = {};

    var letters = xml.getElementsByTagName('char');

    var adjustForTrim = (frame !== undefined && frame.trimmed);


    if (adjustForTrim) {
        var top = frame.height;
        var left = frame.width;
    }

    let widths = [];

    for (var i = 0; i < letters.length; i++) {
        var node = letters[i];

        var charCode = getValue(node, 'id');
        var letter = String.fromCharCode(charCode);
        var gx = getValue(node, 'x');
        var gy = getValue(node, 'y');
        var gw = getValue(node, 'width');
        var gh = getValue(node, 'height');
        widths.push(gw);

        //  Handle frame trim issues

        if (adjustForTrim) {
            if (gx < left) {
                left = gx;
            }

            if (gy < top) {
                top = gy;
            }
        }

        if (adjustForTrim && top !== 0 && left !== 0) {
            //  Now we know the top and left coordinates of the glyphs in the original data
            //  so we can work out how much to adjust the glyphs by

            gx -= frame.x;
            gy -= frame.y;
        }

        var u0 = (textureX + gx) / textureWidth;
        var v0 = (textureY + gy) / textureHeight;
        var u1 = (textureX + gx + gw) / textureWidth;
        var v1 = (textureY + gy + gh) / textureHeight;


        data.chars[charCode] =
        {
            x: gx,
            y: gy,
            width: gw,
            height: gh,
            centerX: Math.floor(gw / 2),
            centerY: Math.floor(gh / 2),
            xOffset: getValue(node, 'xoffset'),
            yOffset: getValue(node, 'yoffset'),
            xAdvance: getValue(node, 'xadvance') + xSpacing,
            data: {},
            kerning: {},
            u0: u0,
            v0: v0,
            u1: u1,
            v1: v1
        };

        if (texture && gw !== 0 && gh !== 0) {
            var charFrame = texture.add(letter, sourceIndex, gx, gy, gw, gh);

            if (charFrame) {
                charFrame.setUVs(gw, gh, u0, v0, u1, v1);
            }
        }
    }


    var kernings = xml.getElementsByTagName('kerning');

    for (i = 0; i < kernings.length; i++) {
        var kern = kernings[i];

        var first = getValue(kern, 'first');
        var second = getValue(kern, 'second');
        var amount = getValue(kern, 'amount');

        data.chars[second].kerning[first] = amount;
    }

    return data;
};

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