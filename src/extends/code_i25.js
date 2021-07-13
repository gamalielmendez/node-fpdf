//Informations
//Author: Matthias Lau
//Author port: Gamaliel Mendez 
//License: FPDF

const {strlen,strtolower,isset} = require('../PHP_CoreFunctions')

function i25(parent,xpos, ypos, code, basewidth=1, height=10){

    let wide = basewidth;
    let narrow = basewidth / 3 ;

    // wide/narrow codes for the digits
    const barChar= {}
    barChar['0'] = 'nnwwn';
    barChar['1'] = 'wnnnw';
    barChar['2'] = 'nwnnw';
    barChar['3'] = 'wwnnn';
    barChar['4'] = 'nnwnw';
    barChar['5'] = 'wnwnn';
    barChar['6'] = 'nwwnn';
    barChar['7'] = 'nnnww';
    barChar['8'] = 'wnnwn';
    barChar['9'] = 'nwnwn';
    barChar['A'] = 'nn';
    barChar['Z'] = 'wn';

    // add leading zero if code-length is odd
    if((code.length % 2) !== 0){
        code = '0'+code;
    }

    parent.SetFont('Arial','',10);
    parent.Text(xpos, ypos + height + 4, code);
    parent.SetFillColor(0);

    // add start and stop codes
    code = `AA${strtolower(code)}ZA`;

    for(let i=0; i<strlen(code); i=i+2){
        // choose next pair of digits
        let charBar = code[i];
        let charSpace = code[i+1];
        // check whether it is a valid digit
        if(!isset(barChar[charBar])){
            parent.Error('Invalid character in barcode: '+charBar);
        }

        if(!isset(barChar[charSpace])){
            parent.Error('Invalid character in barcode: '+charSpace);
        }

        // create a wide/narrow-sequence (first digit=bars, second digit=spaces)
        let seq = '';
        for(let s=0; s<strlen(barChar[charBar]); s++){
            seq += barChar[charBar][s] + barChar[charSpace][s];
        }

        for(let bar=0; bar<strlen(seq); bar++){
            let lineWidth
            // set lineWidth depending on value
            if(seq[bar] === 'n'){
                lineWidth = narrow;
            }else{
                lineWidth = wide;
            }

            // draw every second value, because the second digit of the pair is represented by the spaces
            if((bar % 2) === 0){
                parent.Rect(xpos, ypos, lineWidth, height, 'F');
            }

            xpos += lineWidth;
        }
    }
}


module.exports=i25