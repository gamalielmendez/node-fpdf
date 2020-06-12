const { chr } = require('../PHP_CoreFunctions')

const Font = {
    type: 'Core',
    name: 'ZapfDingbats',
    up: -100,
    ut: 50,
    cw: {
        ' ': 278, '!': 974, '"': 961, '#': 974, '$': 980, '%': 719, '&': 789, '\'': 790, '(': 791, ')': 690,
        '*': 960, '+': 939, ',': 549, '-': 855, '.': 911, '/': 933, '0': 911, '1': 945, '2': 974, '3': 755,
        '4': 846, '5': 762, '6': 761, '7': 571, '8': 677, '9': 763, ':': 760, ';': 759, '<': 754, '=': 494,
        '>': 552, '?': 537, '@': 577, 'A': 692, 'B': 786, 'C': 788, 'D': 788, 'E': 790, 'F': 793, 'G': 794,
        'H': 816, 'I': 823, 'J': 789, 'K': 841, 'L': 823, 'M': 833, 'N': 816, 'O': 831, 'P': 923, 'Q': 744,
        'R': 723, 'S': 749, 'T': 790, 'U': 792, 'V': 695, 'W': 776, 'X': 768, 'Y': 792, 'Z': 759, '[': 707,
        '\\': 708, ']': 682, '^': 701, '_': 826, '`': 815, 'a': 789, 'b': 789, 'c': 707, 'd': 687, 'e': 696,
        'f': 689, 'g': 786, 'h': 787, 'i': 713, 'j': 791, 'k': 785, 'l': 791, 'm': 873, 'n': 761, 'o': 762,
        'p': 762, 'q': 759, 'r': 759, 's': 892, 't': 892, 'u': 788, 'v': 784, 'w': 438, 'x': 138, 'y': 277,
        'z': 415, '{': 392, '|': 392, '}': 668, '~': 668
    },
    uv: {
        32: 32,
        33: [9985, 4],
        37: 9742,
        38: [9990, 4],
        42: 9755,
        43: 9758,
        44: [9996, 28],
        72: 9733,
        73: [10025, 35],
        108: 9679,
        109: 10061,
        110: 9632,
        111: [10063, 4],
        115: 9650,
        116: 9660,
        117: 9670,
        118: 10070,
        119: 9687,
        120: [10072, 7],
        128: [10088, 14],
        161: [10081, 7],
        168: 9827,
        169: 9830,
        170: 9829,
        171: 9824,
        172: [9312, 10],
        182: [10102, 31],
        213: 8594,
        214: [8596, 2],
        216: [10136, 24],
        241: [10161, 14]
    }
}

//se cargan los chr iguales a 278 desde el 0 hasta el 31
for (let i = 0; i < 32; i++) {
    Font.cw[chr(i)] = 0
}

//se cargan los chr iguales a 0 desde el 142 hasta el 160
for (let i = 142; i < 161; i++) {
    Font.cw[chr(i)] = 0
}

//se cargan los chr iguales a 788 desde el 172 hasta el 211
for (let i = 172; i < 212; i++) {
    Font.cw[chr(i)] = 788
}

Font.cw[chr(127)] = 0
Font.cw[chr(128)] = 390
Font.cw[chr(129)] = 390
Font.cw[chr(130)] = 317
Font.cw[chr(131)] = 317
Font.cw[chr(132)] = 276
Font.cw[chr(133)] = 276
Font.cw[chr(134)] = 509
Font.cw[chr(135)] = 509
Font.cw[chr(136)] = 410
Font.cw[chr(137)] = 410
Font.cw[chr(138)] = 234
Font.cw[chr(139)] = 234
Font.cw[chr(140)] = 334
Font.cw[chr(141)] = 334
Font.cw[chr(161)] = 732
Font.cw[chr(162)] = 544
Font.cw[chr(163)] = 544
Font.cw[chr(164)] = 910
Font.cw[chr(165)] = 667
Font.cw[chr(166)] = 760
Font.cw[chr(167)] = 760
Font.cw[chr(168)] = 776
Font.cw[chr(169)] = 595
Font.cw[chr(170)] = 694
Font.cw[chr(171)] = 626
Font.cw[chr(212)] = 894
Font.cw[chr(213)] = 838
Font.cw[chr(214)] = 1016
Font.cw[chr(215)] = 458
Font.cw[chr(216)] = 748
Font.cw[chr(217)] = 924
Font.cw[chr(218)] = 748
Font.cw[chr(219)] = 918
Font.cw[chr(220)] = 927
Font.cw[chr(221)] = 928
Font.cw[chr(222)] = 928
Font.cw[chr(223)] = 834
Font.cw[chr(224)] = 873
Font.cw[chr(225)] = 828
Font.cw[chr(226)] = 924
Font.cw[chr(227)] = 924
Font.cw[chr(228)] = 917
Font.cw[chr(229)] = 930
Font.cw[chr(230)] = 931
Font.cw[chr(231)] = 463
Font.cw[chr(232)] = 883
Font.cw[chr(233)] = 836
Font.cw[chr(234)] = 836
Font.cw[chr(235)] = 867
Font.cw[chr(236)] = 867
Font.cw[chr(237)] = 696
Font.cw[chr(238)] = 696
Font.cw[chr(239)] = 874
Font.cw[chr(240)] = 0
Font.cw[chr(241)] = 874
Font.cw[chr(242)] = 760
Font.cw[chr(243)] = 946
Font.cw[chr(244)] = 771
Font.cw[chr(245)] = 865
Font.cw[chr(246)] = 771
Font.cw[chr(247)] = 888
Font.cw[chr(248)] = 967
Font.cw[chr(249)] = 888
Font.cw[chr(250)] = 831
Font.cw[chr(251)] = 873
Font.cw[chr(252)] = 927
Font.cw[chr(253)] = 970
Font.cw[chr(254)] = 918
Font.cw[chr(255)] = 0

module.exports = Font;
