const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/code128.pdf`

pdf.AddPage();
pdf.SetFont('Arial','B',12);

//A set

let code='CODE 128';
pdf.Code128(50,20,code,80,20);

//B set
code='Code 128';
pdf.Code128(50,70,code,80,20);

//C set
code='12345678901234567890';
pdf.Code128(50,120,code,110,20);

//A,C,B sets
code='ABCDEFG1234567890AbCdEf';
pdf.Code128(50,170,code,125,20);

pdf.Output('f',cPdfName)