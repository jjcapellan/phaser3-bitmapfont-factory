/// <reference types="./phaser" />
import { Task } from "./types";
declare function makeTexture(scene: Phaser.Scene, tasks: Task[], width: number, height: number): Promise<Phaser.Textures.Texture>;
export { makeTexture };
