const { chr } = require('../PHP_CoreFunctions')

const Font = {
    type: 'Core',
    name: 'Helvetica-BoldOblique',
    up: -100,
    ut: 50,
    cw: {
        ' ': 278, '!': 278, '"': 355, '#': 556, '$': 556,
        '%': 889, '&': 667, '\'': 191, '(': 333, ')': 333,
        '*': 389, '+': 584, ',': 278, '-': 333, '.': 278,
        '/': 278, '0': 556, '1': 556, '2': 556, '3': 556,
        '4': 556, '5': 556, '6': 556, '7': 556, '8': 556,
        '9': 556, ':': 278, ';': 278, '<': 584, '=': 584,
        '>': 584, '?': 556, '@': 1015, 'A': 667, 'B': 667,
        'C': 722, 'D': 722, 'E': 667, 'F': 611, 'G': 778,
        'H': 722, 'I': 278, 'J': 500, 'K': 667, 'L': 556,
        'M': 833, 'N': 722, 'O': 778, 'P': 667, 'Q': 778,
        'R': 722, 'S': 667, 'T': 611, 'U': 722, 'V': 667,
        'W': 944, 'X': 667, 'Y': 667, 'Z': 611, '[': 278,
        '\\': 278, ']': 278, '^': 469, '_': 556, '`': 333,
        'a': 556, 'b': 556, 'c': 500, 'd': 556, 'e': 556,
        'f': 278, 'g': 556, 'h': 556, 'i': 222, 'j': 222,
        'k': 500, 'l': 222, 'm': 833, 'n': 556, 'o': 556,
        'p': 556, 'q': 556, 'r': 333, 's': 500, 't': 278,
        'u': 556, 'v': 500, 'w': 722, 'x': 500, 'y': 500,
        'z': 500, '{': 334, '|': 260, '}': 334, '~': 584
    },
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

//se cargan los chr iguales a 278 desde el 0 hasta el 31
for (let i = 0; i < 32; i++) {
    Font.cw[chr(i)] = 278
}

Font.cw[chr(127)] = 350
Font.cw[chr(128)] = 556
Font.cw[chr(129)] = 350
Font.cw[chr(130)] = 222
Font.cw[chr(131)] = 556
Font.cw[chr(132)] = 333
Font.cw[chr(133)] = 1000
Font.cw[chr(134)] = 556
Font.cw[chr(135)] = 556
Font.cw[chr(136)] = 333
Font.cw[chr(137)] = 1000
Font.cw[chr(138)] = 667
Font.cw[chr(139)] = 333
Font.cw[chr(140)] = 1000
Font.cw[chr(141)] = 350
Font.cw[chr(142)] = 611
Font.cw[chr(143)] = 350
Font.cw[chr(144)] = 350
Font.cw[chr(145)] = 222
Font.cw[chr(146)] = 222
Font.cw[chr(147)] = 333
Font.cw[chr(148)] = 333
Font.cw[chr(149)] = 350
Font.cw[chr(150)] = 556
Font.cw[chr(151)] = 1000
Font.cw[chr(152)] = 333
Font.cw[chr(153)] = 1000
Font.cw[chr(154)] = 500
Font.cw[chr(155)] = 333
Font.cw[chr(156)] = 944
Font.cw[chr(157)] = 350
Font.cw[chr(158)] = 500
Font.cw[chr(159)] = 667
Font.cw[chr(160)] = 278
Font.cw[chr(161)] = 333
Font.cw[chr(162)] = 556
Font.cw[chr(163)] = 556
Font.cw[chr(164)] = 556
Font.cw[chr(165)] = 556
Font.cw[chr(166)] = 260
Font.cw[chr(167)] = 556
Font.cw[chr(168)] = 333
Font.cw[chr(169)] = 737
Font.cw[chr(170)] = 370
Font.cw[chr(171)] = 556
Font.cw[chr(172)] = 584
Font.cw[chr(173)] = 333
Font.cw[chr(174)] = 737
Font.cw[chr(175)] = 333
Font.cw[chr(176)] = 400
Font.cw[chr(177)] = 584
Font.cw[chr(178)] = 333
Font.cw[chr(179)] = 333
Font.cw[chr(180)] = 333
Font.cw[chr(181)] = 556
Font.cw[chr(182)] = 537
Font.cw[chr(183)] = 278
Font.cw[chr(184)] = 333
Font.cw[chr(185)] = 333
Font.cw[chr(186)] = 365
Font.cw[chr(187)] = 556
Font.cw[chr(188)] = 834
Font.cw[chr(189)] = 834
Font.cw[chr(190)] = 834
Font.cw[chr(191)] = 611
Font.cw[chr(192)] = 667
Font.cw[chr(193)] = 667
Font.cw[chr(194)] = 667
Font.cw[chr(195)] = 667
Font.cw[chr(196)] = 667
Font.cw[chr(197)] = 667
Font.cw[chr(198)] = 1000
Font.cw[chr(199)] = 722
Font.cw[chr(200)] = 667
Font.cw[chr(201)] = 667
Font.cw[chr(202)] = 667
Font.cw[chr(203)] = 667
Font.cw[chr(204)] = 278
Font.cw[chr(205)] = 278
Font.cw[chr(206)] = 278
Font.cw[chr(207)] = 278
Font.cw[chr(208)] = 722
Font.cw[chr(209)] = 722
Font.cw[chr(210)] = 778
Font.cw[chr(211)] = 778
Font.cw[chr(212)] = 778
Font.cw[chr(213)] = 778
Font.cw[chr(214)] = 778
Font.cw[chr(215)] = 584
Font.cw[chr(216)] = 778
Font.cw[chr(217)] = 722
Font.cw[chr(218)] = 722
Font.cw[chr(219)] = 722
Font.cw[chr(220)] = 722
Font.cw[chr(221)] = 667
Font.cw[chr(222)] = 667
Font.cw[chr(223)] = 611
Font.cw[chr(224)] = 556
Font.cw[chr(225)] = 556
Font.cw[chr(226)] = 556
Font.cw[chr(227)] = 556
Font.cw[chr(228)] = 556
Font.cw[chr(229)] = 556
Font.cw[chr(230)] = 889
Font.cw[chr(231)] = 500
Font.cw[chr(232)] = 556
Font.cw[chr(233)] = 556
Font.cw[chr(234)] = 556
Font.cw[chr(235)] = 556
Font.cw[chr(236)] = 278
Font.cw[chr(237)] = 278
Font.cw[chr(238)] = 278
Font.cw[chr(239)] = 278
Font.cw[chr(240)] = 556
Font.cw[chr(241)] = 556
Font.cw[chr(242)] = 556
Font.cw[chr(243)] = 556
Font.cw[chr(244)] = 556
Font.cw[chr(245)] = 556
Font.cw[chr(246)] = 556
Font.cw[chr(247)] = 584
Font.cw[chr(248)] = 611
Font.cw[chr(249)] = 556
Font.cw[chr(250)] = 556
Font.cw[chr(251)] = 556
Font.cw[chr(252)] = 556
Font.cw[chr(253)] = 500
Font.cw[chr(254)] = 556
Font.cw[chr(255)] = 500

module.exports = Font;
