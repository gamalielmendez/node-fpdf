const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/code39.pdf`
pdf.AddPage();
pdf.Code39(60, 30, 'Code 39');
pdf.Output('f',cPdfName)