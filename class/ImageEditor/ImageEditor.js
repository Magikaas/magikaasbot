class ImageEditor {
    constructor(editor) {
        this.editor = editor;
    }

    setFont(font) {
        this.font = font;
    }

    getFont() {
        return this.font;
    }

    addText(fileName, imageCaption, x, y, size, font) {
        this.editor.read(fileName)
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(typeof font != 'undefined' ? font : Jimp.FONT_SANS_16_BLACK);
            })
            .then(function (font) {
                loadedImage.print(font, x, y, imageCaption)
                        .write(fileName);
            })
            .catch(function (err) {
                console.error(err);
            });
    }
}

module.exports = ImageEditor;