const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/code_i25.pdf`
pdf.AddPage();
pdf.i25(90,40,'12345678');
pdf.Output('f',cPdfName)