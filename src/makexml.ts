/// <reference path="../types/phaser.d.ts" />

import { Task } from "./types";

const makeXML = (task: Task): Document => {
    const fontFamily = task.fontFamily;
    const size = task.style.fontSize.replace('px', '');
    const chars = task.chars;
    const count = task.chars.length;
    const widths = task.fontWidths;
    const height = task.fontHeight;



    //// HEADER BLOCK
    const xmlHeader: string = '<?xml version="1.0"?><font><info face="' + fontFamily +
        '" size="' + size +
        '"></info><common lineHeight="' + size +
        '"></common><chars count="' + count +
        '">';



    //// CHARS BLOCK
    let xPos = 0;
    let yPos = 0;
    let xmlBody: string = '';
    for (let i = 0; i < count; i++) {
        const id = chars[i].charCodeAt(0);
        const width = widths[i];
        const str = `<char id="${id}" x="${xPos}" y="${yPos}" width="${width}" height="${height}"` +
            ` xoffset="0" yoffset="0" xadvance="${width}"/>`;

        xmlBody += str;

        xPos += width;
        if (xPos > task.textureWidth) {
            xPos = 0;
            yPos += height;
        }
    } // end for
    xmlBody += '</chars>';



    //// KERNINGS CLOCK
    let xmlKernings = '';
    if (task.getKernings) {
        const kcount = task.kernings.length;
        const kernings = task.kernings;
        xmlKernings += `<kernings count="${kcount}">`;
        for (let i = 0; i < kcount; i++) {
            let kerning = kernings[i];
            xmlKernings += `<kerning first="${kerning.first}" second="${kerning.second}" amount="${kerning.amount}" />`;
        }
        xmlKernings += '</kernings>';
    }



    //// FOOTER BLOCK
    const xmlFooter = '</font>';




    const xmlString = xmlHeader + xmlBody + xmlKernings + xmlFooter;


    // Converts xmlString into html element
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'application/xml');

    return xml;
}

export { makeXML }