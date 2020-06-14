const FPDF = require('../index')

let textColour = [0, 0, 0];
let logoFile = `${__dirname}/test2.png`;
let logoXPos = 0;
let logoYPos = 10;
let logoWidth = 200;

const pdf = new FPDF('P', 'mm', 'A4');

pdf.SetTextColor(textColour[0], textColour[1], textColour[2]);
pdf.AddPage()

pdf.Image(logoFile, logoXPos, logoYPos, logoWidth);

pdf.Output('F', `${__dirname}/testImageReport.pdf`)

