const FPDF = require('../index')
const pdf=new FPDF();

let cPdfName=`${__dirname}/subwrite.pdf`
pdf.AddPage();

pdf.SetFont('Arial','B',12);

pdf.Write(5,'Hello World!');
pdf.SetX(100);
pdf.Write(5,"This is standard text.\n");
pdf.Ln(12);

pdf.subWrite(10,'H','',33);
pdf.Write(10,'ello World!');
pdf.SetX(100);
pdf.Write(10,"This is text with a capital first letter.\n");
pdf.Ln(12);

pdf.subWrite(5,'Y','',6);
pdf.Write(5,'ou can also begin the sentence with a small letter. And word wrap also works if the line is too long!');

pdf.SetX(100);
pdf.Write(5,"This is text with a small first letter.\n");
pdf.Ln(12);

pdf.Write(5,'The world has a lot of km');
pdf.subWrite(5,'2','',6,4);
pdf.SetX(100);
pdf.Write(5,"This is text with a superscripted letter.\n");
pdf.Ln(12);

pdf.Write(5,'The world has a lot of H');
pdf.subWrite(5,'2','',6,-3);
pdf.Write(5,'O');
pdf.SetX(100);
pdf.Write(5,"This is text with a subscripted letter.\n");

pdf.Output('F', cPdfName)
