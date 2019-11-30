const FPDF = require('../fpdf')

const Doc = new FPDF('P',"mm","A4") 
Doc.AddFont('courier')
Doc.SetTitle("Ejemplo")
Doc.AddPage()
Doc.SetFont('Arial','',8);
Doc.Cell(0,5,'== HOLA MUNDO ==',0,1,'C');
Doc.SetFontSize(12)
Doc.Cell(0,5,'== HOLA MUNDO ==',0,1,'C');
Doc.SetTextColor(255,87,51)
Doc.Cell(0,5,'== HOLA MUNDO ==',0,1,'C');
Doc.Ln()
Doc.Cell(0,5,'PRUEBA DE SALTO DE LINEA',0,1,'C');
Doc.SetAuthor("Gamaliel Mendez")
Doc.SetCreator("Gamaliel Mendez")
Doc.SetSubject("Pruebas de FPDF")
Doc.SetKeywords("FPDF PDF")
Doc.Text(10,90,"Text")
console.log(Doc.PageNo())
Doc.Line(20,99,20,20)
Doc.Rect(50,200,50,20)
Doc.Close()
Doc.Output('F',`${__dirname}/prueba.pdf`)