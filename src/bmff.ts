/// <reference path="../types/phaser.d.ts" />

import ParseXMLBitmapFont from '../node_modules/phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js';
import { makeTexture } from './maketexture.js';
import { makeXML } from './makexml';
import { Task } from './types';

export default class BMFFactory {

    scene: Phaser.Scene;
    tasks: Task[];
    isIdle: boolean;
    maxTextureSize: number;
    powerOfTwo: boolean;
    currentXML: Document;
    currentTexture: Phaser.Textures.Texture;
    currentPendingSteps: number;
    onComplete: () => void;

    constructor(scene: Phaser.Scene, onComplete: () => void) {
        this.scene = scene;
        this.onComplete = onComplete;
        this.tasks = [];
        this.isIdle = true;
        this.maxTextureSize = 2048;
        this.powerOfTwo = true;
        this.currentXML = null;
        this.currentTexture = null;
        this.currentPendingSteps = 0;
    }

    exec() {
        const task = this.tasks.pop();
        if (task == undefined) {
            this.onComplete();
            return;
        }


        // Make glyps
        this.#makeGlyps(task);

        // Set texture dimensions
        this.#setDimensions(task);

        this.currentPendingSteps = 2;
        this.#makeTexture(task); // async
        this.#makeXML(task);
    }

    make(key: string, fontFamily: string, chars: string, style: Phaser.Types.GameObjects.Text.TextStyle = {}) {

        if (style.fontSize == undefined) {
            style.fontSize = '32px';
        }

        const task: Task = {
            chars: chars,
            fontFamily: fontFamily,
            fontHeight: 0,
            fontWidths: [],
            glyps: [],
            key: key,
            style: style,
            textureHeight: 0,
            textureWidth: 0
        }


        this.tasks.push(task);
    }// End make()


    #ceilPowerOfTwo = (n: number): number => {
        // Checks power of two (in binary is 1[...0], so 10000 ^ 10001 == 1)
        if ((n ^ (n + 1)) != 1) {
            // 10011 << 1 ; 100110 & (1 << 5) ; 100000 (upper power of two)
            n = (n << 1) & (1 << (n.toString(2).length));
        }
        return n;
    }

    #finish = (key: string) => {
        const texture = this.currentTexture;
        const xml = this.currentXML;
        const frame = this.scene.textures.getFrame(key);
        const fontData = ParseXMLBitmapFont(xml, frame, 0, 0, texture);

        this.scene.cache.bitmapFont.add(key, { data: fontData, texture: key, frame: null });

        // Executes next task
        this.exec();
    }

    #makeGlyps = (task: Task) => {
        const chars = task.chars;
        const count = chars.length;

        for (let i = 0; i < count; i++) {
            const char = chars[i];
            let glyp = this.scene.make.text({ text: char, style: task.style }, false);
            task.glyps.push(glyp);
        }
    }

    #makeTexture = async (task: Task) => {
        this.currentTexture = await makeTexture(this.scene, task);
        this.#step(task);
    }

    #makeXML = (task: Task) => {
        this.currentXML = makeXML(task);
        this.#step(task);
    }

    #step = (task: Task) => {
        this.currentPendingSteps -= 1;
        if (this.currentPendingSteps == 0) {
            this.#finish(task.key);
        }
    }

    #setDimensions = (task: Task) => {
        const glyps = task.glyps;
        const count = glyps.length;
        let maxCharWidth = 0;
        let textureWidth = 0;
        let textureHeight = 0;

        // Gets char widths
        for (let i = 0; i < count; i++) {
            let width = glyps[i].getBounds().width;
            task.fontWidths.push(width);
            textureWidth += width;
            if (width > maxCharWidth) {
                maxCharWidth = width;
            }
        }

        // Chars height
        task.fontHeight = glyps[0].getBounds().height;
        textureHeight = task.fontHeight;

        // Apply size limits
        if (textureWidth > this.maxTextureSize) {
            textureHeight *= Math.ceil(textureWidth / this.maxTextureSize);
            textureWidth = this.maxTextureSize;
        }

        // Snaps to power of two
        textureWidth = this.#ceilPowerOfTwo(textureWidth);
        textureHeight = this.#ceilPowerOfTwo(textureHeight);

        task.textureWidth = textureWidth;
        task.textureHeight = textureHeight;

    }


}
