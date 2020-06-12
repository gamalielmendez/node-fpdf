const FPDF = require('../index')
const { strtoupper, substr } = require('../src/PHP_CoreFunctions')



let textypos = 5;

const pdf = new FPDF($orientation = 'P', $unit = 'mm', [45, 350]);

pdf.AddPage()
pdf.SetFont('Arial', 'B', 8) //Letra Arial, negrita (Bold), tam. 20
pdf.SetY(2)
pdf.SetX(2)
pdf.Cell(5, textypos, "NOMBRE DE LA EMPRESA")
pdf.SetFont('Arial', '', 5);    //Letra Arial, negrita (Bold), tam. 20
textypos += 6
pdf.SetX(2)
pdf.Cell(5, textypos, '-------------------------------------------------------------------')
textypos += 6
pdf.SetX(2)
pdf.Cell(5, textypos, 'CANT.  ARTICULO       PRECIO               TOTAL')

let total = 0
let off = textypos + 6
let producto = { "q": 1, "name": "Computadora Lenovo i5", "price": 100 }
let productos = [producto, producto, producto, producto, producto]

productos.forEach(pro => {

    pdf.SetX(2)
    pdf.Cell(5, off, pro["q"])
    pdf.SetX(6)
    pdf.Cell(35, off, strtoupper(substr(pro["name"], 0, 12)))
    pdf.SetX(20)
    pdf.Cell(11, off, `$${pro["price"].toFixed(2)}`, 0, 0, "R")
    pdf.SetX(32);
    pdf.Cell(11, off, "$ " + (pro["q"] * pro["price"]).toFixed(2), 0, 0, "R")

    total += pro["q"] * pro["price"];
    off += 6;

})

textypos = off + 6
pdf.SetX(2)
pdf.Cell(5,textypos,"TOTAL: " )
pdf.SetX(38)
pdf.Cell(5,textypos,"$ "+total.toFixed(2),0,0,"R")
pdf.SetX(2)
pdf.Cell(5,textypos+6,'GRACIAS POR TU COMPRA ')
pdf.Output('F',`${__dirname}/ticket.pdf`)