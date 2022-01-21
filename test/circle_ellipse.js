const FPDF = require('../index')
let cPdfName=`${__dirname}/circle_ellipse.pdf`

const pdf = new FPDF();
pdf.AddPage();
pdf.Ellipse(100,50,30,20);
pdf.SetFillColor(255,255,0);
pdf.Circle(110,47,7,'F');
pdf.Output('f',cPdfName)