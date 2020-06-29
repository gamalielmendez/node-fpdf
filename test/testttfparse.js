const TTFParser = require('../src/makefont/ttfparser')

let filenale = `${__dirname}/FreeSans.ttf`;

const myfont = new TTFParser(filenale)
myfont.Parse()