/// <reference path="../types/phaser.d.ts" />

// Phaser limits the size of snapshot to canvas size, so this workaround is necessary

function rtSnapshot(
    rt: Phaser.GameObjects.RenderTexture,
    renderer: Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback
) {

    if (rt.renderTarget) {
        const r = renderer as Phaser.Renderer.WebGL.WebGLRenderer;
        rtSnapshotWebgl(rt, r, callback);
    }
}

function rtSnapshotWebgl(
    rt: Phaser.GameObjects.RenderTexture,
    renderer: Phaser.Renderer.WebGL.WebGLRenderer,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback
) {

    const currentFrameBuffer = renderer.currentFramebuffer;
    const state = renderer.snapshotState;

    state.callback = callback;
    state.type = 'image/png';
    state.encoderOptions = 1;
    state.getPixel = false;
    state.x = 0;
    state.y = 0;
    state.width = rt.width;
    state.height = rt.height;
    state.isFramebuffer = true;
    state.bufferWidth = rt.width;
    state.bufferHeight = rt.height;

    renderer.setFramebuffer(rt.renderTarget.framebuffer);

    Phaser.Renderer.Snapshot.WebGL(renderer.canvas, state);

    renderer.setFramebuffer(currentFrameBuffer);

    state.callback = null;
    state.isFramebuffer = false;

    return renderer;
}

export { rtSnapshot }