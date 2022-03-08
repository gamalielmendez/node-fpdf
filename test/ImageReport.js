const FPDF = require('../index')

let textColour = [0, 0, 0];
let logoFile = `${__dirname}/test4.png`;
let logoXPos = 70;
let logoYPos = 10;
let logoWidth = 100;

const pdf = new FPDF('P', 'mm', 'A4');
pdf.grid = 10;   
pdf.SetTextColor(textColour[0], textColour[1], textColour[2]);
pdf.AddPage()
pdf.SetTitle("prueba")
pdf.Image(logoFile, logoXPos, logoYPos, 50,50);

pdf.Output('F', `${__dirname}/testImageReport.pdf`)

