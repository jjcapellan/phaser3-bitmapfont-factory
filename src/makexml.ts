import { Task } from "./types";

const makeXMLs = (tasks: Task[]): Document[] => {

    let xmls: Document[] = [];


    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const chars = task.chars;
        const count = task.chars.length;
        const fontFamily = task.fontFamily;
        const size = task.style.fontSize.replace('px', '');
        const glyphs = task.glyphs;
        const lineHeight = Number.parseInt(size);



        //// HEADER BLOCK
        const xmlHeader: string = '<?xml version="1.0"?><font><info face="' + fontFamily +
            '" size="' + size +
            '"></info><common lineHeight="' + size +
            '"></common><chars count="' + count +
            '">';



        //// CHARS BLOCK
        let xmlBody: string = '';
        for (let j = 0; j < count; j++) {
            const glyph = glyphs[j];
            const id = glyph.id;
            const offsetY = glyph.printY - glyph.xmlY;
            const str = `<char id="${id}" x="${glyph.xmlX}" y="${glyph.xmlY}" width="${glyph.xmlWidth}" height="${glyph.xmlHeight}"` +
                ` xoffset="${glyph.xmlXoffset}" yoffset="${lineHeight - offsetY}" xadvance="${glyph.xmlXadvance}"/>`;

            xmlBody += str;
        } // end for
        xmlBody += '</chars>';



        //// KERNINGS CLOCK
        let xmlKernings = '';
        if (task.getKernings) {
            const kcount = task.kernings.length;
            const kernings = task.kernings;
            xmlKernings += `<kernings count="${kcount}">`;
            for (let j = 0; j < kcount; j++) {
                let kerning = kernings[j];
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

        xmls.push(xml);
    }//end for

    return xmls;
}

export { makeXMLs }