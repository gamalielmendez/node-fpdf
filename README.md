![GitHub Sponsor](https://img.shields.io/github/sponsors/gamalielmendez?label=Sponsor&logo=GitHub)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/gamalielmendez)
# node-fpdf
Port de la biblioteca FPDF de PHP a JavaScript, totalmente compatible con la biblioteca original. Puedes encontrar el proyecto y la documentación originales [aqui](http://www.fpdf.org/).

### **Apoyar el proyecto**
[![alt text](https://www.paypalobjects.com/es_XC/MX/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HJT3RJKJ44EWQ&source=url
)

### Para Instalar

```shell 
$ npm i node-fpdf 
````
```shell 
$ yarn add node-fpdf 
````

### Ejemplo de uso
```javascript 
const FPDF = require('node-fpdf')
const pdf = new FPDF('P','mm','A4');

pdf.AddPage();
pdf.SetFont('Arial','B',12);
pdf.Cell(5,5,"HOLA MUNDO!!");
pdf.Output('F',`test.pdf`);
```` 
### Ejemplo de uso de PHP_CoreFunctions 
```javascript 
const {isset} = require('node-fpdf/PHP_CoreFunctions')

console.log(isset(1))
```` 

### **Fuentes Disponibles**
- **courier**
- **helvetica**
- **symbol**
- **times**
- **zapfdingbats**

### **Funciones Disponibles**
-  **AcceptPageBreak** - acepta o no un salto de página automático
-  **AddFont** - añade una nueva fuente
-  **AddLink** - crea una referencia interna
-  **AddPage** - añade una nueva página
-  **AliasNbPages** - define un alias para el número de páginas
-  **Cell** - imprime un celda
-  **Close** - termina el documento
-  **Error** - error fatal
-  **Footer** - pie de página
-  **GetPageHeight** - devuelve la altura actual de la página
-  **GetPageWidth** - devuelve el ancho actual de la página
-  **GetStringWidth** - calcula la longitud de la cadena
-  **GetX** - obtiene la posición actual de x
-  **GetY** - obtiene la posición actual de y
-  **Header** - cabecera de página
-  **Image** - imprime una imagen (solo acepta jpeg,jpg,png)
-  **Line** - dibuja un línea
-  **Link** - pone una referencia
-  **Ln** - salto de línea
-  **MultiCell** - imprime texto con saltos de línea
-  **Output** - guarda o envía el documento ('f'->escribe un archivo en disco,'s'-> retorna un string,'p'-> imprime el archivo,'base64'-> retorna un string en base 64)
-  **PageNo** - número de página
-  **Rect** - dibuja un rectangulo
-  **SetAuthor** - establece el autor del documento
-  **SetAutoPageBreak** - establece el modo de salto de pagina automático
-  **SetCreator** - establece el creador del documento
-  **SetDisplayMode** - establece el modo de presentación
-  **SetDrawColor** - establece el color de graficación
-  **SetFillColor** - establece el color de relleno
-  **SetFont** - establece la fuente
-  **SetFontSize** - establece el tamaño de la fuente
-  **SetKeywords** - asocia las palabras claves con el documento
-  **SetLeftMargin** - establece el márgen izquierdo
-  **SetLineWidth** - establece el ancho de la línea
-  **SetLink** - establece el enlace de destino
-  **SetMargins** - establece los márgenes
-  **SetRightMargin** - establece el márgen derecho
-  **SetSubject** - establece el tema del documento
-  **SetTextColor** - establece el color del texto
-  **SetTitle** - establece el título del documento
-  **SetTopMargin** - Establece el márgen superior
-  **SetX** - establece la posición actual de x
-  **SetXY** - establece la posición actual de x y y
-  **SetY** - establece la posición actual de y
-  **Text** - imprime una cadena
-  **Write** - imprime el siguiente texto

### **Extensiones Adicionales**
-  [**Code128**](/test/code128.js) - imprime un codigo de barras en formato CODE128(A,B,C,ABC)
-  [**Code39**](/test/code39.js) - imprime un codigo de barras en formato CODE39
-  [**i25**](/test/code_i25.js)- imprime un codigo de barras en formato i25
-  [**EAN13**](/test/ean13.js)- imprime un codigo de barras en formato EAN13
-  **UPC_A**- imprime un codigo de barras en formato UPC_A
-  [**RotatedText**](/test/rotatetext.js) - rota un texto en grados de 0 a 360
-  **SetWatermark** - coloca una marca de agua en la pagina
-  [**ShadowCell**](/test/shadowcell.js) - Imprime un texto con sombra
-  [**IncludeJS**](/test/js_test.js) - Añade un script en el lenguaje JavaScript
-  [**Bookmark**](/test/bookmark.js) -  Añade Bookmark
-  [**CreateIndexFromBookmark**](/test/Bookmark_index_test.js) -  Crea Un indice del documento cuando tiene Bookmark
-  [**DrawGrid**](/test/gridtest.js) -  Crea un grid en la hoja util para diseñar reportes
-  [**RoundedRect**](/test/RoundedRect.js) -  Dibuja un rectangulo con las esquinas redondeadas
-  **Ellipse** -  Dibuja un elipse
-  **Circle** -  Dibuja un circulo
-  [**DashedRect**](/test/DashedRect.js) -  Dibuja un rectangulo con borde punteado
-  [**subWrite**](/test/subWrite.js) - Escribe Texto De Diferentes tamaños
-  **Set_Font_Size_Label** - establece el tamaño de la fuente de la etiqueta
-  [**Add_Label**](/test/labels_test.js) - Agrega una etiqueta al documento

#### Puedes encontrar ejemplos de uso *[aqui](https://github.com/gamalielmendez/node-fpdf/tree/master/test)*
#### Utilidad de consola para hacer compatibles tus fuentes *[aqui](https://www.npmjs.com/package/makefont_njs)*
