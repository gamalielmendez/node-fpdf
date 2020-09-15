const FPDF = require('../index')
let cPdfName=`${__dirname}/rotateText.pdf`

const pdf = new FPDF();
pdf.AddPage();
pdf.SetFont('Arial','',20);
pdf.RotatedText(100,60,'Hello!',45);
pdf.SetWatermark('Esta es una marca de agua')
pdf.Output('f',cPdfName)