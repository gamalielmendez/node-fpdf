const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/shadowcell.pdf`
pdf.SetFont('Arial','',30);

pdf.AddPage();    
pdf.SetTextColor(255,  255, 255);
for (let i = 1; i < 6; i++) {
    let Text =`Gray shadow with ${i / 2} distance`
    pdf.ShadowCell(0, 40, Text, 1, 1, 'C', true, '', 'G', i / 2);
    pdf.Ln(10);
}

pdf.AddPage();    
pdf.SetTextColor(0, 0, 255);
for (let i = 1; i < 6; i++) {
    let Text =`Black shadow with ${i / 2} distance`
    pdf.ShadowCell(0, 40, Text, 1, 1, 'C', false, '', 'B', i / 2);
    pdf.Ln(10);
}

pdf.Output('F', cPdfName)
