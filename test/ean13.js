const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/code_EAN13.pdf`
pdf.AddPage();
pdf.EAN13(80,40,'123456789012');
pdf.Output('f',cPdfName)