
const Font = {
    type: 'Core',
    name: 'Courier-BoldOblique',
    up: -100,
    ut: 50,
    cw: new Array(255),
    enc: 'cp1252',
    uv: {
        0: [0, 128],
        128: 8364,
        130: 8218,
        131: 402,
        132: 8222,
        133: 8230,
        134: [8224, 2],
        136: 710,
        137: 8240,
        138: 352,
        139: 8249,
        140: 338,
        142: 381,
        145: [8216, 2],
        147: [8220, 2],
        149: 8226,
        150: [8211, 2],
        152: 732,
        153: 8482,
        154: 353,
        155: 8250,
        156: 339,
        158: 382,
        159: 376,
        160: [160, 96]
    }
}

//se inicializa el cw
for (let index = 0; index < 255; index++) {
    Font.cw[String.fromCharCode(index)] = 600;
}

module.exports = Font;
