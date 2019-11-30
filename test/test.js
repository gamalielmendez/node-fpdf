const FPDF = require('../fpdf')

const Doc = new FPDF('P',"mm","A4") 
Doc.AddFont('courier')
Doc.AddPage()
Doc.SetFont('Arial','',20);
Doc.Cell(0,5,'== HOLA MUNDO ==',0,1,'C');
Doc.Close()
Doc.Output('F',`${__dirname}/prueba.pdf`)