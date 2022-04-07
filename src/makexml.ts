import { Task } from "./types";

const makeXML = (task: Task): Document => {
    const chars = task.chars;
    const count = task.chars.length;
    const fontFamily = task.fontFamily;
    const height = task.fontHeight;
    const size = task.style.fontSize.replace('px', '');
    const widths = task.fontWidths;



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

const makeAllXML = (tasks: Task[]): Document[] => {

    let xmls: Document[] = [];


    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const chars = task.chars;
        const count = task.chars.length;
        const fontFamily = task.fontFamily;
        const size = task.style.fontSize.replace('px', '');
        const bounds = task.glyphsBounds;



        //// HEADER BLOCK
        const xmlHeader: string = '<?xml version="1.0"?><font><info face="' + fontFamily +
            '" size="' + size +
            '"></info><common lineHeight="' + size +
            '"></common><chars count="' + count +
            '">';



        //// CHARS BLOCK
        let xmlBody: string = '';
        for (let j = 0; j < count; j++) {
            const id = chars[j].charCodeAt(0);
            const b = bounds[j];
            const str = `<char id="${id}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"` +
                ` xoffset="0" yoffset="0" xadvance="${b.w}"/>`;

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

export { makeXML, makeAllXML }