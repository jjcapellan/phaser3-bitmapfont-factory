# v1.0.0
First stable version.
## Features
* Converts any loaded font[^1] in the browser to a bitmapfont, ready to use in Phaser3 at runtime.
* Shares same texture for multiple bitmapfonts.
* Ensures power of two texture size (optional).
* Calcs kernings for 97 commonly used pairs. (optional).
* Supports list of fallback fonts.
* Predefined fallback font lists for sans-serif, sans, and monospace types.

[^1]: Fonts with ligatures are not supported.