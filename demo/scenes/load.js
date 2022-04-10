class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {

        this.loadedWF = true;

        // webfont used: https://fonts.google.com/specimen/Shadows+Into+Light#about
        WebFont.load({
            google: {
                families: ['Shadows Into Light']
            },
            fontactive: (name) => {
                console.log('Active: ', name);
                this.generateBitmapFonts();
            },
            timeout: 2000,
            fontinactive: (name) => {
                console.log('Inactive: ', name);
                this.loadedWF = false;
                this.generateBitmapFonts();
            }
        });

    }

    generateBitmapFonts() {

        const chars = ' abcdefghijklmnopqarstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
        const chars2 = ' Kerigsonf:WAYV.v';
        let t0 = performance.now();

        const bmff = new BMFFactory(this, () => {
            let t = Math.round(performance.now() - t0);
            this.scene.start('test', { time: t });
        });

        if (this.loadedWF) {
            bmff.make('webfont', 'Shadows Into Light', chars, { fontSize: '42px', color: '#555568' }, true);
        }

        bmff.make('sansserif', bmff.defaultFonts.sansSerif, chars, { fontSize: '42px', color: '#555568' }, true);
        bmff.make('serif', bmff.defaultFonts.serif, chars, { fontSize: '42px', color: '#555568' }, true);
        bmff.make('monospace', bmff.defaultFonts.monospace, chars, { fontSize: '42px', color: '#555568' });
        bmff.make('kerning', 'Arial', chars2, { fontSize: '42px', color: '#555568' }, true);
        bmff.make('nokerning', 'Arial', chars2, { fontSize: '42px', color: '#555568' });
        bmff.exec();
    }
}