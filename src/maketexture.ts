import CanvasSnapshot from "../node_modules/phaser/src/renderer/snapshot/CanvasSnapshot.js"
import { Task } from "./types";

async function makeTexture(scene: Phaser.Scene, tasks: Task[], width: number, height: number): Promise<Phaser.Textures.Texture> {

    const key = tasks[0].key;
    const rtHeight = height;
    const rtWidth = width;

    const rt = scene.make.renderTexture({ x: 0, y: 0, width: rtWidth, height: rtHeight, }, false);
    rt.setOrigin(0);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const glyphs = task.glyphs;
        const bounds = task.glyphsBounds;

        for (let j = 0; j < glyphs.length; j++) {
            const b = bounds[j];
            rt.draw(glyphs[j], b.x, b.y);
        }

    }

    // Converts renderTexture to Phaser.texture
    // (Using a renderTexture.saveTexture() in next steps produces an inverted text) 
    function rtToTexture(): Promise<Phaser.Textures.Texture> {
        return new Promise(resolve => {
            rtSnapshot(rt, scene.renderer,
                (img: any) => {
                    scene.textures.addImage(key, img);
                    let texture = scene.textures.get(key);
                    rt.destroy();
                    resolve(texture);
                });
        })
    }

    return rtToTexture();
}



// Phaser limits the size of snapshot to canvas size, so this workaround is necessary

function rtSnapshot(
    rt: Phaser.GameObjects.RenderTexture,
    renderer: Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback
) {

    if (rt.renderTarget) {
        const r = renderer as Phaser.Renderer.WebGL.WebGLRenderer;
        rtSnapshotWebgl(rt, r, callback);
    } else {
        const r = renderer as Phaser.Renderer.Canvas.CanvasRenderer;
        rtSnapshotCanvas(rt, r, callback);
    }
}

function rtSnapshotWebgl(
    rt: Phaser.GameObjects.RenderTexture,
    renderer: Phaser.Renderer.WebGL.WebGLRenderer,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback
) {

    const currentFrameBuffer = renderer.currentFramebuffer;
    const state = renderer.snapshotState;

    state.bufferHeight = rt.height;
    state.bufferWidth = rt.width;
    state.callback = callback;
    state.encoderOptions = 1;
    state.getPixel = false;
    state.height = rt.height;
    state.isFramebuffer = true;
    state.type = 'image/png';
    state.width = rt.width;
    state.x = 0;
    state.y = 0;

    renderer.setFramebuffer(rt.renderTarget.framebuffer);

    Phaser.Renderer.Snapshot.WebGL(renderer.canvas, state);

    renderer.setFramebuffer(currentFrameBuffer);

    state.callback = null;
    state.isFramebuffer = false;

    return renderer;
}

function rtSnapshotCanvas(
    rt: Phaser.GameObjects.RenderTexture,
    renderer: Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback) {

    const state: any = renderer.snapshotState;

    state.callback = callback;
    state.encoder = 1;          // not match type Phaser.Types.Renderer.Snapshot.SnapshotState (check renderer phaser code)
    state.getPixel = false;
    state.height = rt.height;
    state.type = 'image/png';
    state.width = rt.width;
    state.x = 0;
    state.y = 0;

    CanvasSnapshot(rt.canvas, state);

    state.callback = null;

    return renderer;
}

export { makeTexture }
