const FPDF = require('../fpdf')

const Doc = new FPDF('P',"mm",[45,350]) 
Doc.AddFont('courier')
Doc.AddPage()
Doc.SetFont('Arial','',8);
Doc.Cell(0,5,'== Nueva Cuenta ==',1,1,'C');
Doc.Close()
Doc.Output()