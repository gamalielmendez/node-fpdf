
const fs = require('fs')

module.exports = class FPDF {

    constructor(orientation = 'P', unit = 'mm', size = 'A4', fontpath = "") {

        // Initialization of properties
        this.state = 0;
        this.page = 0;
        this.n = 2;
        this.buffer = '';
        this.pages = new Array();
        this.PageInfo = new Array();
        this.fonts = new Array();
        this.FontFiles = new Array();
        this.encodings = new Array();
        this.cmaps = new Array();
        this.images = new Array();
        this.links = new Array();
        this.InHeader = false;
        this.InFooter = false;
        this.lasth = 0;
        this.FontFamily = '';
        this.FontStyle = '';
        this.FontSizePt = 12;
        this.underline = false;
        this.DrawColor = '0 G';
        this.FillColor = '0 g';
        this.TextColor = '0 g';
        this.ColorFlag = false;
        this.WithAlpha = false;
        this.ws = 0;

        if (fontpath !== '') {

            this.fontpath = fontpath
            if (this.fontpath.charAt(this.fontpath.length - 1) != "/") {
                this.fontpath += "/"
            }

        } else if (fs.existsSync(`${__dirname}/fonts`)) {
            this.fontpath = `${__dirname}/fonts/`
        } else {
            throw "directorio de fuentes no encontrado"
        }

        // Core fonts
        this.CoreFonts = {}
        this.CoreFonts["courier"] = "Courier"
        this.CoreFonts["courierB"] = "Courier-Bold"
        this.CoreFonts["courierI"] = "Courier-Oblique"
        this.CoreFonts["courierBI"] = "Courier-BoldOblique"
        this.CoreFonts["helvetica"] = "Helvetica"
        this.CoreFonts["helveticaB"] = "Helvetica-Bold"
        this.CoreFonts["helveticaI"] = "Helvetica-Oblique"
        this.CoreFonts["helveticaBI"] = "Helvetica-BoldOblique"
        this.CoreFonts["times"] = "Times-Roman"
        this.CoreFonts["timesB"] = "Times-Bold"
        this.CoreFonts["timesI"] = "Times-Italic"
        this.CoreFonts["timesBI"] = "Times-BoldItalic"
        this.CoreFonts["symbol"] = "Symbol"
        this.CoreFonts["zapfdingbats"] = "ZapfDingbats"

        // Scale factor
        if (unit == 'pt') { this.k = 1 }
        else if (unit == 'mm') { this.k = (72 / 25.4) }
        else if (unit == 'cm') { this.k = (72 / 2.54) }
        else if (unit == 'in') { this.k = 72 }
        else { throw `Unidad de Medida incorrecta ${unit}` }

        // Page sizes
        this.StdPageSizes={}
        this.StdPageSizes["a3"] = [841.89,1190.55]
        this.StdPageSizes["a4"] = [595.28,841.89]
        this.StdPageSizes["a5"] = [420.94,595.28]
        this.StdPageSizes["letter"] = [612,792]
        this.StdPageSizes["legal"] = [612,1008]

        size = this._getpagesize(size)
        this.DefPageSize = size
        this.CurPageSize = size

        // Page orientation
        orientation=orientation.toLowerCase() 
        if(orientation==='p' || orientation==='portrait'){
            
            this.DefOrientation = 'P'
            this.CurOrientation = this.DefOrientation
            this.w = this.CurPageSize[0]
            this.h = this.CurPageSize[1] 

        }else if(orientation==='l' || orientation==='landscape'){
            
            this.DefOrientation = 'L'
            this.CurOrientation = this.DefOrientation
            this.w = this.CurPageSize[1]
            this.h = this.CurPageSize[0]

        }else{
            throw `orientacion no valida.`   
        }
        
        this.wPt = (this.w*this.k)
        this.hPt = (this.h*this.k)
        
        // Page rotation
        this.CurRotation = 0
        // Page margins (1 cm)
	    const margin = (28.35/this.k)
        this.SetMargins(margin,margin)
        // Interior cell margin (1 mm)
	    this.cMargin = margin/10
	    // Line width (0.2 mm)
	    this.LineWidth = 0.567/this.k
        // Automatic page break
        this.SetAutoPageBreak(true,2*margin)
        // Default display mode
        this.SetDisplayMode()
        // Enable compression
        this.SetCompression(true);
        // Set default PDF version number
        this.PDFVersion = '1.3'
    }
    
    SetCompression(xcompress) {
       
        if (this.function_exists("gzcompress")){
            this.compress = xcompress;
        }else{
            this.compress = false;
        }
            
    }

    SetDisplayMode(zoom ='default', layout='default'){   
        
        // Set display mode in viewer
        if(zoom=='fullpage' || zoom=='fullwidth' || zoom=='real' || zoom=='default' || !(typeof zoom ==='string' )){
            this.ZoomMode = zoom
        }else{
            throw `Valor de zoom de incorrecto.`     
        }

        if(layout=='single' || layout=='continuous' || layout=='two' || layout=='default'){
            this.LayoutMode = layout
        }else{
            throw `Modo display incorrecto.`     
        }

    }

    SetAutoPageBreak(auto, margin=0)
    {
        // Set auto page break mode and triggering margin
        this.AutoPageBreak = auto;
        this.bMargin = margin;
        this.PageBreakTrigger = this.h-margin;
    }

    SetMargins(left, top, right=null)
    {
        // Set left, top and right margins
        this.lMargin = left
        this.tMargin = top
        if(right===null){
            right = left
        }
            
        this.rMargin = right;
    }

    _getpagesize(size){
        
        if(typeof size ==="string"){
            
            size=size.toLowerCase()
            if(size in this.StdPageSizes){
                
                const a =this.StdPageSizes[size]
                return [a[0]/this.k,a[1]/this.k] 

            }else{
                throw `formato de papel desconocido.`   
            }

        }else if( Array.isArray(size) ){
            
            if(size.length>1){
                
                if(size[0]>size[1]){
                    return [size[1],size[0]]
                }else{
                    return size
                }  

            }else{
                throw `formato de papel desconocido.`  
            }

        }else{
            throw `formato de papel desconocido.`
        }

    } 

    function_exists(name){
        return false;
    }

}

