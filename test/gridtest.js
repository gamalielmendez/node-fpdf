const FPDF = require('../index')
const pdf=new FPDF();
let cPdfName=`${__dirname}/GridTest.pdf`
// Add page with a grid and default spacing (5mm)
pdf.grid = true;
pdf.AddPage();

// Add page with a grid (10mm spacing)
pdf.grid = 10;
pdf.AddPage();

// Disable grid
pdf.grid = false;
pdf.AddPage();

pdf.Output('f',cPdfName)