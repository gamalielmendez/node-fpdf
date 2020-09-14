const ttfparser = require('../makefont/ttfparser')

const path = `${__dirname}/calligra.ttf`
const Font = new ttfparser(path)

Font.Parse()