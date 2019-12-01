const FPDF = require('../index')

let textypos = 5;
const pdf = new FPDF($orientation='P',$unit='mm', [45,350]);
pdf.AddPage();
pdf.SetFont('Arial','I',8);
pdf.SetY(2);
pdf.SetX(2);
pdf.Cell(5,textypos,"NOMBRE DE LA EMPRESA");
pdf.SetFont('Arial','BI',5); 
textypos+=6;
pdf.SetX(2);
pdf.Cell(5,textypos,'-------------------------------------------------------------------')
textypos+=6;
pdf.SetX(2);
pdf.Cell(5,textypos,'CANT.  ARTICULO       PRECIO               TOTAL')

let total =0;
let off = textypos+6;
const producto={
    "q":1,
	"name":"Computadora",
	"price":100  
}

aProductos=[producto,producto,producto,producto,producto]
aProductos.map((val)=>{
    pdf.SetX(2);
    pdf.Cell(5,off,val["q"]);
    pdf.SetX(6);
    pdf.Cell(35,off,val["name"]);
    pdf.SetX(20);
    pdf.Cell(11,off,`$${val['price'].toFixed(1)}`);
    pdf.SetX(32);
    pdf.Cell(11,off,`$${(val['price']*val['q']).toFixed(1)}`);
    total += val["q"]*val["price"];
    off+=6;
})

textypos=off+6;
pdf.SetX(2);
pdf.Cell(5,textypos,"TOTAL: " );
pdf.SetX(38);
pdf.Cell(5,textypos,`$${total.toFixed(1)}`);
pdf.SetX(2);
pdf.Cell(5,textypos+6,'GRACIAS POR TU COMPRA ');
pdf.Output('F',`${__dirname}/ticket.pdf`);
