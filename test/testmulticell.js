const FPDF = require('../index')

let cPdfName=`${__dirname}/testmulticell.pdf`
const pdf = new FPDF('P','mm', [48, 3276]);

pdf.AddPage()
pdf.SetFont('Times', 'B', 8) //Letra Arial, negrita (Bold), tam. 20
pdf.SetY(5)
pdf.SetX(0)
const txt =`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

pdf.SetLeftMargin(2)
pdf.SetRightMargin(2)
pdf.MultiCell(43,5,txt)
pdf.Output('f',cPdfName)