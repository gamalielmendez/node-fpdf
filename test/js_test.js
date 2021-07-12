    const FPDF = require('../index')

    let cPdfName=`${__dirname}/js_test.pdf`
    let scriptjs=`app.alert('Hello, World!')`

    const pdf = new FPDF();
    pdf.AddPage()
    pdf.SetFont('Times', 'B', 8) //Letra Arial, negrita (Bold), tam. 20
    pdf.SetY(2)
    pdf.SetX(2)
    pdf.Cell(5, 5, "Ejemplo de pdf con javascript")
    pdf.IncludeJS(scriptjs)
    pdf.Output('f',cPdfName)

