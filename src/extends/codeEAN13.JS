
const {substr} = require('../PHP_CoreFunctions')

function EAN13(parent,x, y, barcode, h=16, w=.35){
    return Barcode(parent,x,y,barcode,h,w,13);
}

function UPC_A(parent,x, y, barcode, h=16, w=.35){
    return Barcode(parent,x,y,barcode,h,w,12);
}

function GetCheckDigit(barcode)
{
    //Compute the check digit
    let sum=0;
    for(let i=1;i<=11;i+=2){
        sum+=3*barcode[i];
    }
        
    for(let i=0;i<=10;i+=2){
        sum+=barcode[i];
    }
        
    let r=sum%10;
    if(r>0){
        r=10-r;
    }
        
    return r;
}

function TestCheckDigit(barcode)
{
    //Test validity of check digit
    let sum=0;
    for(let i=1;i<=11;i+=2){
        sum+=3*barcode[i];
    }
        
    for(let i=0;i<=10;i+=2){
        sum+=barcode[i];
    }

    return (sum+barcode[12])%10==0;
}

function Barcode(parent,x, y, barcode, h, w, len)
{
    //Padding
    barcode=barcode.padStart(len-1,'0')  //str_pad($barcode,$len-1,'0',STR_PAD_LEFT);
    if(len===12){
        barcode=`0${barcode}`;
    }
    //Add or control the check digit
    if(barcode.length ===12){
        barcode+=GetCheckDigit(barcode);
    }else if(!TestCheckDigit(barcode)){
        parent.Error('Incorrect check digit');
    }

    //Convert digits to bars

    const codes = {
        "A":{
            '0':'0001101','1':'0011001','2':'0010011','3':'0111101','4':'0100011',
            '5':'0110001','6':'0101111','7':'0111011','8':'0110111','9':'0001011'      
        },
        "B":{
            '0':'0100111','1':'0110011','2':'0011011','3':'0100001','4':'0011101',
            '5':'0111001','6':'0000101','7':'0010001','8':'0001001','9':'0010111'
        },
        "C":{
            '0':'1110010','1':'1100110','2':'1101100','3':'1000010','4':'1011100',
            '5':'1001110','6':'1010000','7':'1000100','8':'1001000','9':'1110100'
        }
    } 

    const parities={
        '0':['A','A','A','A','A','A'],
        '1':['A','A','B','A','B','B'],
        '2':['A','A','B','B','A','B'],
        '3':['A','A','B','B','B','A'],
        '4':['A','B','A','A','B','B'],
        '5':['A','B','B','A','A','B'],
        '6':['A','B','B','B','A','A'],
        '7':['A','B','A','B','A','B'],
        '8':['A','B','A','B','B','A'],
        '9':['A','B','B','A','B','A']
    }

    let code='101';
    let p=parities[barcode[0]];
    for(let i=1;i<=6;i++){
        code+=codes[p[i-1]][barcode[i]];
    }

    code+='01010';
    for(let i=7;i<=12;i++){
        code+=codes['C'][barcode[i]];
    }
    code+='101';
    //Draw bars
    for(let i=0;i<code.length;i++)
    {
        if(code[i]==='1'){
            parent.Rect(x+i*w,y,w,h,'F');
        }
    }
    //Print text uder barcode
    parent.SetFont('Arial','',12);
    parent.Text(x,y+h+11/parent.k,substr(barcode,-len));
}

module.exports = {
    EAN13,
    UPC_A
}