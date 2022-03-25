const FPDF = require('../index')

let cPdfName=`${__dirname}/testsetfont.pdf`
const pdf = new FPDF('P','mm', [48, 3276]);

pdf.AddPage()
pdf.AddFont('DJBMonogram','','DJBMonogram.js')
pdf.SetFont('DJBMonogram','', 8) //Letra Arial, negrita (Bold), tam. 20
pdf.SetY(5)
pdf.SetX(0)
const txt =`Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet`

pdf.SetLeftMargin(2)
pdf.SetRightMargin(2)
pdf.MultiCell(43,5,txt)
pdf.Output('f',cPdfName)