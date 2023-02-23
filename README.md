![GitHub Sponsor](https://img.shields.io/github/sponsors/gamalielmendez?label=Sponsor&logo=GitHub)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/gamalielmendez)
# node-fpdf
### port de la libreria FPDF de PHP a Javascript totalmente compatible con la libreria original Puedes encontar  proyecto y documentacion original [aqui](http://www.fpdf.org/)
### **Apoyar el proyecto con paypal**
[![alt text](https://www.paypalobjects.com/es_XC/MX/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HJT3RJKJ44EWQ&source=url
)
### **Apoyar con brave tokens**
### ir a repositorio de [GitHub](https://github.com/gamalielmendez/node-fpdf) con el navegador brave y deja una propina

### **Apoyar proyecto en Patreon**
[![alt text](https://onlcontent.blob.core.windows.net/images/cimga7b6940b4f4c422180c268a12a6d39d2_ico.png)](https://www.patreon.com/user?u=70304264)

# Para Instalar
```javascript 
npm i node-fpdf 
//o
yarn add node-fpdf
````
# Como se Usa
```javascript 
const FPDF = require('node-fpdf')
const pdf = new FPDF('P','mm','A4');

pdf.AddPage();
pdf.SetFont('Arial','B',12);
pdf.Cell(5,5,"HOLA MUNDO!!");
pdf.Output('F',`test.pdf`);
```` 
# Como se Usa PHP_CoreFunctions 
```javascript 
const {isset} = require('node-fpdf/PHP_CoreFunctions')

console.log(isset(1))

```` 

# **Fuentes Disponibles**
- [x] courier
- [x] helvetica
- [x] symbol
- [x] times
- [x] zapfdingbats

# **Funciones Disponibles**
- [x] *AcceptPageBreak - acepta o no un salto de página automático*
- [x] *AddFont - añade una nueva fuente*
- [x] *AddLink - crea una referencia interna*
- [x] *AddPage - añade una nueva página*
- [x] *AliasNbPages - define un alias para el número de páginas*
- [x] *Cell - imprime un celda*
- [x] *Close - termina el documento*
- [x] *Error - error fatal*
- [x] *Footer - pie de página*
- [x] *GetPageHeight - devuelve la altura actual de la página*
- [x] *GetPageWidth - devuelve el ancho actual de la página*
- [x] *GetStringWidth - calcula la longitud de la cadena*
- [x] *GetX - obtiene la posición actual de x*
- [x] *GetY - obtiene la posición actual de y*
- [x] *Header - cabecera de página*
- [x] *Image - imprime una imagen (solo acepta jpeg,jpg,png)*
- [x] *Line - dibuja un línea*
- [x] *Link - pone una referencia*
- [x] *Ln - salto de línea*
- [x] *MultiCell - imprime texto con saltos de línea*
- [x] *Output - guarda o envía el documento ('f'->escribe un archivo en disco,'s'-> retorna un string,'p'-> imprime el archivo,'base64'-> retorna un string en base 64)*
- [x] *PageNo - número de página*
- [x] *Rect - dibuja un rectangulo*
- [x] *SetAuthor - establece el autor del documento*
- [x] *SetAutoPageBreak - establece el modo de salto de pagina automático*
- [x] *SetCreator - establece el creador del documento*
- [x] *SetDisplayMode - establece el modo de presentación*
- [x] *SetDrawColor - establece el color de graficación*
- [x] *SetFillColor - establece el color de relleno*
- [x] *SetFont - establece la fuente*
- [x] *SetFontSize - establece el tamaño de la fuente*
- [x] *SetKeywords - asocia las palabras claves con el documento*
- [x] *SetLeftMargin - establece el márgen izquierdo*
- [x] *SetLineWidth - establece el ancho de la línea*
- [x] *SetLink - establece el enlace de destino*
- [x] *SetMargins - establece los márgenes*
- [x] *SetRightMargin - establece el márgen derecho*
- [x] *SetSubject - establece el tema del documento*
- [x] *SetTextColor - establece el color del texto*
- [x] *SetTitle - establece el título del documento*
- [x] *SetTopMargin - Establece el márgen superior*
- [x] *SetX - establece la posición actual de x*
- [x] *SetXY - establece la posición actual de x y y*
- [x] *SetY - establece la posición actual de y*
- [x] *Text - imprime una cadena*
- [x] *Write - imprime el siguiente texto*

# **Extensiones Adicionales**
- [x] *Code128 - imprime un codigo de barras en formato CODE128(A,B,C,ABC)*
- [x] *Code39 - imprime un codigo de barras en formato CODE39*
- [x] *i25- imprime un codigo de barras en formato i25*
- [x] *EAN13- imprime un codigo de barras en formato EAN13*
- [x] *UPC_A- imprime un codigo de barras en formato UPC_A*
- [x] *RotatedText - rota un texto en grados de 0 a 360*
- [x] *SetWatermark - coloca una marca de agua en la pagina*
- [x] *ShadowCell - Imprime un texto con sombra*
- [x] *IncludeJS - Añade un script en el lenguaje JavaScript*
- [x] *Bookmark -  Añade Bookmark*
- [x] *CreateIndexFromBookmark -  Crea Un indice del documento cuando tiene Bookmark*
- [x] *DrawGrid -  Crea un grid en la hoja util para diseñar reportes*
- [x] *RoundedRect -  Dibuja un rectangulo con las esquinas redondeadas*
- [x] *Ellipse -  Dibuja un elipse*
- [x] *Circle -  Dibuja un circulo*
- [x] *DashedRect -  Dibuja un rectangulo con borde punteado*
- [x] *subWrite - Escribe Texto De Diferentes tamaños*
- [x] *Set_Font_Size_Label - establece el tamaño de la fuente de la etiqueta*
- [x] *Add_Label - Agrega una etiqueta al documento*

 #### **Puedes encontrar ejemplos de uso [aqui](https://github.com/gamalielmendez/node-fpdf/tree/master/test)**
 #### **Utilidad de consola para hacer compatibles tus fuentes [aqui](https://www.npmjs.com/package/makefont_njs)**
