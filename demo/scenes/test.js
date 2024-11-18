class Test extends Phaser.Scene {
    constructor() {
        super('test');
    }

    init(data) {
        this.duration = data.time;
        this.totalGlyphs = data.glyphs;
        this.totalFonts = data.fonts;
    }

    create() {
        this.add.text(400, 15, 'Bitmapfonts used below were generated at runtime with BMFFactory v2.0.0', { color: '#555568' })
            .setOrigin(0.5);
        const bmfTexture = this.textures.exists('webfont') ?
            this.textures.get('webfont').source[0] : this.textures.get('sansserif').source[0];

        const txt = `Font loaded via WebFont`;
        const txt1 = `Sans Serif default font`;
        const txt2 = `Serif default font`;
        const txt3 = `Monospace default font`;
        const txt4 = `Kernings on: WA AY V. Av`;
        const txt5 = `Kernings off: WA AY V. Av`;
        const txt6 = `${this.totalFonts} fonts and ${this.totalGlyphs} glyphs in ${this.duration}ms\nonProgress option uses 2 frames per font\nTexture size ${bmfTexture.width}x${bmfTexture.height}`;


        const vMargin = 80;
        const top = 50;
        if (this.cache.bitmapFont.exists('webfont')) {
            this.add.bitmapText(400, top, 'webfont', txt, 42).setOrigin(0.5);
        }
        this.add.bitmapText(400, 30 + vMargin, 'sansserif', txt1, 42).setOrigin(0.5);
        this.add.bitmapText(400, 30 + vMargin * 2, 'serif', txt2, 42).setOrigin(0.5);
        this.add.bitmapText(400, 30 + vMargin * 3, 'monospace', txt3, 42).setOrigin(0.5);
        this.add.bitmapText(400, 30 + vMargin * 4, 'kerning', txt4, 42).setOrigin(0.5);
        this.add.bitmapText(400, 30 + vMargin * 5 - 40, 'nokerning', txt5, 42).setOrigin(0.5);
        this.add.bitmapText(400, 30 + vMargin * 6, 'monospace', txt6, 32).setOrigin(0.5);
        //let img = this.add.image(0, 0, 'webfont', '__BASE').setOrigin(0, 0);
    }
}