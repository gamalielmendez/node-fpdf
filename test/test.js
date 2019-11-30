const FPDF = require('../fpdf')

const Doc = new FPDF() 
Doc.AddFont('courier')
Doc.AddPage()
Doc.SetFont('Arial','',8);
Doc.Cell(0,5,'== Nueva Cuenta ==',0,0,'C');