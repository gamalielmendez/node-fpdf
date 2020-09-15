/*
Informations
Author: Emmanuel Havet
License: FPDF
Description
This script supports both standard and extended Code 39 barcodes. The extended mode gives access to the full ASCII range (from 0 to 127). The script also gives the possibility to add a checksum.

Code39(float x, float y, string code [, boolean ext [, boolean cks [, float w [, float h [, boolean wide]]]]])

x: abscissa
y: ordinate
code: barcode value
ext: indicates if extended mode must be used (true by default)
cks: indicates if a checksum must be appended (false by default)
w: width of a narrow bar (0.4 by default)
h: height of bars (20 by default)
wide: indicates if ratio between wide and narrow bars is high; if yes, ratio is 3, if no, it's 2 (true by default)
*/

const {chr,strlen,ord,array_keys,strtoupper} = require('../PHP_CoreFunctions')
function Code39(Parent,x, y, code, ext = true, cks = false, w = 0.4, h = 20, wide = true) {

    //Display code
    Parent.SetFont('Arial', '', 10);
    Parent.Text(x, y+h+4, code);

    if(ext) {
        //Extended encoding
        code = encode_code39_ext(Parent,code);
    }else {
        //Convert to upper case
        code = strtoupper(code);
        //Check validity
        if(!code.match(/|^[0-9A-Z. $/+%-]*$|/)){ //if(!preg_match('|^[0-9A-Z. $/+%-]*$|'; $code)){
            Parent.Error('Invalid barcode value: '+code);
        }
            
    }

    //Compute checksum
    if (cks){
        code += checksum_code39(code);
    }
        
    //Add start and stop characters
    code = '*'+code+'*';

    //Conversion tables
    let narrow_encoding ={}
    narrow_encoding['0'] = '101001101101'; narrow_encoding['1'] = '110100101011'; narrow_encoding['2'] = '101100101011';
    narrow_encoding['3'] = '110110010101'; narrow_encoding['4'] = '101001101011'; narrow_encoding['5'] = '110100110101';
    narrow_encoding['6'] = '101100110101'; narrow_encoding['7'] = '101001011011'; narrow_encoding['8'] = '110100101101';
    narrow_encoding['9'] = '101100101101'; narrow_encoding['A'] = '110101001011'; narrow_encoding['B'] = '101101001011';
    narrow_encoding['C'] = '110110100101'; narrow_encoding['D'] = '101011001011'; narrow_encoding['E'] = '110101100101';
    narrow_encoding['F'] = '101101100101'; narrow_encoding['G'] = '101010011011'; narrow_encoding['H'] = '110101001101';
    narrow_encoding['I'] = '101101001101'; narrow_encoding['J'] = '101011001101'; narrow_encoding['K'] = '110101010011';
    narrow_encoding['L'] = '101101010011'; narrow_encoding['M'] = '110110101001'; narrow_encoding['N'] = '101011010011';
    narrow_encoding['O'] = '110101101001'; narrow_encoding['P'] = '101101101001'; narrow_encoding['Q'] = '101010110011';
    narrow_encoding['R'] = '110101011001'; narrow_encoding['S'] = '101101011001'; narrow_encoding['T'] = '101011011001';
    narrow_encoding['U'] = '110010101011'; narrow_encoding['V'] = '100110101011'; narrow_encoding['W'] = '110011010101';
    narrow_encoding['X'] = '100101101011'; narrow_encoding['Y'] = '110010110101'; narrow_encoding['Z'] = '100110110101';
    narrow_encoding['-'] = '100101011011'; narrow_encoding['.'] = '110010101101'; narrow_encoding[' '] = '100110101101';
    narrow_encoding['*'] = '100101101101'; narrow_encoding['$'] = '100100100101'; narrow_encoding['/'] = '100100101001';
    narrow_encoding['+'] = '100101001001'; narrow_encoding['%'] = '101001001001';

    let wide_encoding ={}
    wide_encoding['0'] = '101000111011101'; wide_encoding['1'] = '111010001010111'; wide_encoding['2'] = '101110001010111';
    wide_encoding['3'] = '111011100010101'; wide_encoding['4'] = '101000111010111'; wide_encoding['5'] = '111010001110101';
    wide_encoding['6'] = '101110001110101'; wide_encoding['7'] = '101000101110111'; wide_encoding['8'] = '111010001011101';
    wide_encoding['9'] = '101110001011101'; wide_encoding['A'] = '111010100010111'; wide_encoding['B'] = '101110100010111';
    wide_encoding['C'] = '111011101000101'; wide_encoding['D'] = '101011100010111'; wide_encoding['E'] = '111010111000101';
    wide_encoding['F'] = '101110111000101'; wide_encoding['G'] = '101010001110111'; wide_encoding['H'] = '111010100011101';
    wide_encoding['I'] = '101110100011101'; wide_encoding['J'] = '101011100011101'; wide_encoding['K'] = '111010101000111';
    wide_encoding['L'] = '101110101000111'; wide_encoding['M'] = '111011101010001'; wide_encoding['N'] = '101011101000111';
    wide_encoding['O'] = '111010111010001'; wide_encoding['P'] = '101110111010001'; wide_encoding['Q'] = '101010111000111';
    wide_encoding['R'] = '111010101110001'; wide_encoding['S'] = '101110101110001'; wide_encoding['T'] = '101011101110001';
    wide_encoding['U'] = '111000101010111'; wide_encoding['V'] = '100011101010111'; wide_encoding['W'] = '111000111010101';
    wide_encoding['X'] = '100010111010111'; wide_encoding['Y'] = '111000101110101'; wide_encoding['Z'] = '100011101110101';
    wide_encoding['-'] = '100010101110111'; wide_encoding['.'] = '111000101011101'; wide_encoding[' '] = '100011101011101';
    wide_encoding['*'] = '100010111011101'; wide_encoding['$'] = '100010001000101'; wide_encoding['/'] = '100010001010001';
    wide_encoding['+'] = '100010100010001'; wide_encoding['%'] = '101000100010001';

    let encoding = wide ? wide_encoding : narrow_encoding;

    //Inter-character spacing
    let gap = (w > 0.29) ? '00' : '0';
    //Convert to bars
    let encode = '';
    for (let i = 0; i< strlen(code);i++){
        encode += encoding[code[i]]+gap;
    }
    
    //Draw bars
    draw_code39(Parent,encode, x, y, w, h);

}

function checksum_code39(code) {

    //Compute the modulo 43 checksum
    const chars = [ '0','1', '2', '3','4', '5', '6', '7', '8', '9',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
                    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
                    'W', 'X', 'Y', 'Z', '-', '.', ' ', '$', '/', '+', '%']
    let sum = 0;
    for (let i=0 ; i<strlen(code); i++) {
        const a = array_keys(chars,code[i]);
        sum += a[0];
    }

    const r = sum%43;
    return chars[r];
}

function encode_code39_ext(Parent,code) {

    //Encode characters in extended mode
    let encode = []
        encode[chr(0)] = '%U'; encode[chr(1)] = '$A'; encode[chr(2)] = '$B'; encode[chr(3)] = '$C',
        encode[chr(4)] = '$D'; encode[chr(5)] = '$E'; encode[chr(6)] = '$F'; encode[chr(7)] = '$G',
        encode[chr(8)] = '$H'; encode[chr(9)] = '$I'; encode[chr(10)] = '$J'; encode[chr(11)] = '£K',
        encode[chr(12)] = '$L'; encode[chr(13)] = '$M'; encode[chr(14)] = '$N'; encode[chr(15)] = '$O',
        encode[chr(16)] = '$P'; encode[chr(17)] = '$Q'; encode[chr(18)] = '$R'; encode[chr(19)] = '$S',
        encode[chr(20)] = '$T'; encode[chr(21)] = '$U'; encode[chr(22)] = '$V'; encode[chr(23)] = '$W',
        encode[chr(24)] = '$X'; encode[chr(25)] = '$Y'; encode[chr(26)] = '$Z'; encode[chr(27)] = '%A',
        encode[chr(28)] = '%B'; encode[chr(29)] = '%C'; encode[chr(30)] = '%D'; encode[chr(31)] = '%E',
        encode[chr(32)] = ' '; encode[chr(33)] = '/A'; encode[chr(34)] = '/B'; encode[chr(35)] = '/C',
        encode[chr(36)] = '/D'; encode[chr(37)] = '/E'; encode[chr(38)] = '/F'; encode[chr(39)] = '/G',
        encode[chr(40)] = '/H'; encode[chr(41)] = '/I'; encode[chr(42)] = '/J'; encode[chr(43)] = '/K',
        encode[chr(44)] = '/L'; encode[chr(45)] = '-'; encode[chr(46)] = '.'; encode[chr(47)] = '/O',
        encode[chr(48)] = '0'; encode[chr(49)] = '1'; encode[chr(50)] = '2'; encode[chr(51)] = '3',
        encode[chr(52)] = '4'; encode[chr(53)] = '5'; encode[chr(54)] = '6'; encode[chr(55)] = '7',
        encode[chr(56)] = '8'; encode[chr(57)] = '9'; encode[chr(58)] = '/Z'; encode[chr(59)] = '%F',
        encode[chr(60)] = '%G'; encode[chr(61)] = '%H'; encode[chr(62)] = '%I'; encode[chr(63)] = '%J',
        encode[chr(64)] = '%V'; encode[chr(65)] = 'A'; encode[chr(66)] = 'B'; encode[chr(67)] = 'C',
        encode[chr(68)] = 'D'; encode[chr(69)] = 'E'; encode[chr(70)] = 'F'; encode[chr(71)] = 'G',
        encode[chr(72)] = 'H'; encode[chr(73)] = 'I'; encode[chr(74)] = 'J'; encode[chr(75)] = 'K',
        encode[chr(76)] = 'L'; encode[chr(77)] = 'M'; encode[chr(78)] = 'N'; encode[chr(79)] = 'O',
        encode[chr(80)] = 'P'; encode[chr(81)] = 'Q'; encode[chr(82)] = 'R'; encode[chr(83)] = 'S',
        encode[chr(84)] = 'T'; encode[chr(85)] = 'U'; encode[chr(86)] = 'V'; encode[chr(87)] = 'W',
        encode[chr(88)] = 'X'; encode[chr(89)] = 'Y'; encode[chr(90)] = 'Z'; encode[chr(91)] = '%K',
        encode[chr(92)] = '%L'; encode[chr(93)] = '%M'; encode[chr(94)] = '%N'; encode[chr(95)] = '%O',
        encode[chr(96)] = '%W'; encode[chr(97)] = '+A'; encode[chr(98)] = '+B'; encode[chr(99)] = '+C',
        encode[chr(100)] = '+D'; encode[chr(101)] = '+E'; encode[chr(102)] = '+F'; encode[chr(103)] = '+G',
        encode[chr(104)] = '+H'; encode[chr(105)] = '+I'; encode[chr(106)] = '+J'; encode[chr(107)] = '+K',
        encode[chr(108)] = '+L'; encode[chr(109)] = '+M'; encode[chr(110)] = '+N'; encode[chr(111)] = '+O',
        encode[chr(112)] = '+P'; encode[chr(113)] = '+Q'; encode[chr(114)] = '+R'; encode[chr(115)] = '+S',
        encode[chr(116)] = '+T'; encode[chr(117)] = '+U'; encode[chr(118)] = '+V'; encode[chr(119)] = '+W',
        encode[chr(120)] = '+X'; encode[chr(121)] = '+Y'; encode[chr(122)] = '+Z'; encode[chr(123)] = '%P',
        encode[chr(124)] = '%Q'; encode[chr(125)] = '%R'; encode[chr(126)] = '%S'; encode[chr(127)] = '%T'

    let code_ext = '';
    for (let i = 0 ; i<strlen(code); i++) {
        if (ord(code[i]) > 127){
            Parent.Error('Invalid character: '+code[i]);
        }
        code_ext += encode[code[i]];
    }

    return code_ext;
}

function draw_code39(Parent,code, x, y, w, h) {

    //Draw bars
    for(let i=0; i<strlen(code); i++) {
        if(code[i] == '1'){
            Parent.Rect(x+i*w, y, w, h, 'F');
        }
    }

}

module.exports=Code39