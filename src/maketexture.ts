import { Task } from "./types";

async function makeTexture(scene: Phaser.Scene, tasks: Task[], width: number, height: number): Promise<Phaser.Textures.Texture> {

    const key = tasks[0].key;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const glyphs = task.glyphs;
        ctx.font = task.font;
        ctx.fillStyle = task.style.color ? task.style.color : 'white';

        for (let j = 0; j < glyphs.length; j++) {
            const glyph = glyphs[j];
            ctx.fillText(glyph.letter, glyph.printX, glyph.printY);
        }
    }


    function canvasToTexture(): Promise<Phaser.Textures.Texture> {
        return new Promise(resolve => {
            canvas.toBlob(
                blob => {
                    const image = document.createElement('img');
                    const url = URL.createObjectURL(blob);
                    image.onload = () => {
                        scene.textures.addImage(key, image);
                        let texture = scene.textures.get(key);
                        URL.revokeObjectURL(url);
                        resolve(texture);
                    };
                    image.src = url;
                },
                'image/png'
            );
        });
    }

    return canvasToTexture();
}

export { makeTexture }
