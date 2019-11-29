
const fs = require('fs')
const sprintf = require('sprintf-js').sprintf

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
        this.enc = ''
        this.subsetted = ''

        if (fontpath !== '') {

            this.fontpath = fontpath
            if (this.fontpath.charAt(this.fontpath.length - 1) !== "/") {
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
        this.StdPageSizes = {}
        this.StdPageSizes["a3"] = [841.89, 1190.55]
        this.StdPageSizes["a4"] = [595.28, 841.89]
        this.StdPageSizes["a5"] = [420.94, 595.28]
        this.StdPageSizes["letter"] = [612, 792]
        this.StdPageSizes["legal"] = [612, 1008]

        size = this._getpagesize(size)
        this.DefPageSize = size
        this.CurPageSize = size

        // Page orientation
        orientation = orientation.toLowerCase()
        if (orientation === 'p' || orientation === 'portrait') {

            this.DefOrientation = 'P'
            this.CurOrientation = this.DefOrientation
            this.w = this.CurPageSize[0]
            this.h = this.CurPageSize[1]

        } else if (orientation === 'l' || orientation === 'landscape') {

            this.DefOrientation = 'L'
            this.CurOrientation = this.DefOrientation
            this.w = this.CurPageSize[1]
            this.h = this.CurPageSize[0]

        } else {
            throw `orientacion no valida.`
        }

        this.wPt = (this.w * this.k)
        this.hPt = (this.h * this.k)

        // Page rotation
        this.CurRotation = 0
        // Page margins (1 cm)
        const margin = (28.35 / this.k)
        this.SetMargins(margin, margin)
        // Interior cell margin (1 mm)
        this.cMargin = margin / 10
        // Line width (0.2 mm)
        this.LineWidth = 0.567 / this.k
        // Automatic page break
        this.SetAutoPageBreak(true, 2 * margin)
        // Default display mode
        this.SetDisplayMode()
        // Enable compression
        this.SetCompression(true);
        // Set default PDF version number
        this.PDFVersion = '1.3'
    }

    AddFont(family = '', style = '', file = '') {

        // Add a TrueType, OpenType or Type1 font
        family = family.toLowerCase()
        if (file == '') { file = `${family.replace(' ', '')}${style.toLowerCase()}.js` }

        style = style.toUpperCase()
        if (style === 'IB') { style = 'BI' }

        const fontkey = family + style;
        if (typeof this.fonts[fontkey] !== 'undefined') {
            return
        }

        const info = this._loadfont(file)
        info['i'] = (this.fonts.length + 1)

        if (typeof info['file'] !== 'undefined') {

            if (info.type === 'TrueType') {
                this.FontFiles[info['file']] = { 'length1': info['originalsize'] }
            } else {
                this.FontFiles[info['file']] = { 'length1': info['size1'], 'length2': info['size2'] }
            }
        }

        this.fonts[fontkey] = info
    }

    SetFont(family, style = '', size = 0) {

        // Select a font; size given in points
        if (family === '') {
            family = this.FontFamily
        } else {
            family = family.toLowerCase()
        }

        style = style.toUpperCase()
        if (style.indexOf('U') !== -1) {
            this.underline = true
            style = style.replace('U', '')
        } else {
            this.underline = false;
        }

        if (style === 'IB') { style = 'BI' }
        if (size === 0) { size = this.FontSizePt }

        // Test if font is already selected
        if (this.FontFamily === family && this.FontStyle === style && this.FontSizePt == size) { return }

        // Test if font is already loaded
        let fontkey = family + style
        if (typeof this.fonts[fontkey] === 'undefined') {

            // Test if one of the core fonts
            if (family == 'arial') {
                //family = 'helvetica';
                family = 'courier';
            }

            if (family in this.CoreFonts) {

                if (family === 'symbol' || family === 'zapfdingbats') {
                    style = '';
                }

                fontkey = family + style;
                if (typeof this.fonts[fontkey] === 'undefined') {
                    this.AddFont(family, style)
                }

            } else {
                throw `Undefined font: ${family} ${style}`
            }


        }

        // Select it
        this.FontFamily = family;
        this.FontStyle = style;
        this.FontSizePt = size;
        this.FontSize = size / this.k;
        this.CurrentFont = this.fonts[fontkey]

        if (this.page > 0) {
            this._out(sprintf('BT /F%d %.2f Tf ET', this.CurrentFont['i'], this.FontSizePt));
        }

    }

    AddLink() {

        // Create a new internal link
        const n = (this.links.length + 1)
        this.links[n] = [0, 0]
        return n;

    }

    AddPage(orientation = '', size = '', rotation = 0) {

        if (this.state === 3) {
            throw "The document is closed"
        }

        const family = this.FontFamily;
        const style = this.FontStyle + (this.underline ? 'U' : '');
        const fontsize = this.FontSizePt;
        const lw = this.LineWidth;
        const dc = this.DrawColor;
        const fc = this.FillColor;
        const tc = this.TextColor;
        const cf = this.ColorFlag;

        if (this.page > 0) {
            // Page footer
            this.InFooter = true;
            this.Footer();
            this.InFooter = false;
            // Close page
            this._endpage();
        }

        // Start new page
        this._beginpage(orientation, size, rotation);

        // Set line cap style to square
        this._out('2 J');

        // Set line width
        this.LineWidth = lw;
        this._out(sprintf("%.2f w", lw * this.k));

        // Set font
        if (family !== '') {
            this.SetFont(family, style, fontsize);
        }

        // Set colors
        this.DrawColor = dc
        if (dc !== '0 G') { this._out(dc) }

        this.FillColor = fc;
        if (fc !== '0 g') { this._out(fc) }

        this.TextColor = tc
        this.ColorFlag = cf

        // Page header
        this.InHeader = true;
        this.Header();
        this.InHeader = false;

        // Restore line width
        if (this.LineWidth !== lw) {
            this.LineWidth = lw;
            this._out(sprintf('%.2f w', lw * this.k));
        }

        // Restore font
        if (family !== '') {
            this.SetFont(family, style, fontsize)
        }

        // Restore colors
        if (this.DrawColor !== dc) {
            this.DrawColor = dc
            this._out(dc)
        }

        if (this.FillColor !== fc) {
            this.FillColor = fc
            this._out(fc)
        }

        this.TextColor = tc;
        this.ColorFlag = cf;

    }

    AliasNbPages(alias = '{nb}') {
        // Define an alias for total number of pages
        this.AliasNbPages = alias;
    }

    Cell($w, $h = 0, $txt = '', $border = 0, $ln = 0, $align = '', $fill = false, $link = '') {
        /*
        // Output a cell
        $k = $this->k;
        if($this->y+$h>$this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak())
        {
            // Automatic page break
            $x = $this->x;
            $ws = $this->ws;
            if($ws>0)
            {
                $this->ws = 0;
                $this->_out('0 Tw');
            }
            $this->AddPage($this->CurOrientation,$this->CurPageSize,$this->CurRotation);
            $this->x = $x;
            if($ws>0)
            {
                $this->ws = $ws;
                $this->_out(sprintf('%.3F Tw',$ws*$k));
            }
        }
        if($w==0)
            $w = $this->w-$this->rMargin-$this->x;
        $s = '';
        if($fill || $border==1)
        {
            if($fill)
                $op = ($border==1) ? 'B' : 'f';
            else
                $op = 'S';
            $s = sprintf('%.2F %.2F %.2F %.2F re %s ',$this->x*$k,($this->h-$this->y)*$k,$w*$k,-$h*$k,$op);
        }
        if(is_string($border))
        {
            $x = $this->x;
            $y = $this->y;
            if(strpos($border,'L')!==false)
                $s .= sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,$x*$k,($this->h-($y+$h))*$k);
            if(strpos($border,'T')!==false)
                $s .= sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-$y)*$k);
            if(strpos($border,'R')!==false)
                $s .= sprintf('%.2F %.2F m %.2F %.2F l S ',($x+$w)*$k,($this->h-$y)*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
            if(strpos($border,'B')!==false)
                $s .= sprintf('%.2F %.2F m %.2F %.2F l S ',$x*$k,($this->h-($y+$h))*$k,($x+$w)*$k,($this->h-($y+$h))*$k);
        }
        if($txt!=='')
        {
            if(!isset($this->CurrentFont))
                $this->Error('No font has been set');
            if($align=='R')
                $dx = $w-$this->cMargin-$this->GetStringWidth($txt);
            elseif($align=='C')
                $dx = ($w-$this->GetStringWidth($txt))/2;
            else
                $dx = $this->cMargin;
            if($this->ColorFlag)
                $s .= 'q '.$this->TextColor.' ';
            $s .= sprintf('BT %.2F %.2F Td (%s) Tj ET',($this->x+$dx)*$k,($this->h-($this->y+.5*$h+.3*$this->FontSize))*$k,$this->_escape($txt));
            if($this->underline)
                $s .= ' '.$this->_dounderline($this->x+$dx,$this->y+.5*$h+.3*$this->FontSize,$txt);
            if($this->ColorFlag)
                $s .= ' Q';
            if($link)
                $this->Link($this->x+$dx,$this->y+.5*$h-.5*$this->FontSize,$this->GetStringWidth($txt),$this->FontSize,$link);
        }
        if($s)
            $this->_out($s);
        $this->lasth = $h;
        if($ln>0)
        {
            // Go to next line
            $this->y += $h;
            if($ln==1)
                $this->x = $this->lMargin;
        }
        else
            $this->x += $w;*/
    }

    Header() { /* To be implemented in your own inherited class*/ }
    Footer() { /* To be implemented in your own inherited class*/ }

    SetCompression(xcompress) {

        if (this.function_exists("gzcompress")) {
            this.compress = xcompress;
        } else {
            this.compress = false;
        }

    }

    SetDisplayMode(zoom = 'default', layout = 'default') {

        // Set display mode in viewer
        if (zoom == 'fullpage' || zoom == 'fullwidth' || zoom == 'real' || zoom == 'default' || !(typeof zoom === 'string')) {
            this.ZoomMode = zoom
        } else {
            throw `Valor de zoom de incorrecto.`
        }

        if (layout == 'single' || layout == 'continuous' || layout == 'two' || layout == 'default') {
            this.LayoutMode = layout
        } else {
            throw `Modo display incorrecto.`
        }

    }

    SetAutoPageBreak(auto, margin = 0) {
        // Set auto page break mode and triggering margin
        this.AutoPageBreak = auto;
        this.bMargin = margin;
        this.PageBreakTrigger = this.h - margin;
    }

    SetMargins(left, top, right = null) {
        // Set left, top and right margins
        this.lMargin = left
        this.tMargin = top
        if (right === null) {
            right = left
        }

        this.rMargin = right;
    }

    _getpagesize(size) {

        if (typeof size === "string") {

            size = size.toLowerCase()
            if (size in this.StdPageSizes) {

                const a = this.StdPageSizes[size]
                return [a[0] / this.k, a[1] / this.k]

            } else {
                throw `formato de papel desconocido.`
            }

        } else if (Array.isArray(size)) {

            if (size.length > 1) {

                if (size[0] > size[1]) {
                    return [size[1], size[0]]
                } else {
                    return size
                }

            } else {
                throw `formato de papel desconocido.`
            }

        } else {
            throw `formato de papel desconocido.`
        }

    }

    function_exists(name) {
        return false;
    }

    _beginpage(orientation, size, rotation) {

        this.page++;
        this.pages[this.page] = '';
        this.state = 2;
        this.x = this.lMargin;
        this.y = this.tMargin;
        this.FontFamily = '';

        // Check page size and orientation
        if (orientation === '') { orientation = this.DefOrientation; }
        else { orientation = orientation[0].toUpperCase() }

        if (size === '') { size = this.DefPageSize }
        else { size = this._getpagesize(size) }

        if (orientation !== this.CurOrientation || size[0] !== this.CurPageSize[0] || size[1] !== this.CurPageSize[1]) {

            // New size or orientation
            if (orientation === 'P') {
                this.w = size[0];
                this.h = size[1];
            } else {
                this.w = size[1];
                this.h = size[0];
            }

            this.wPt = this.w * this.k;
            this.hPt = this.h * this.k;
            this.PageBreakTrigger = this.h - this.bMargin;
            this.CurOrientation = orientation;
            this.CurPageSize = size;
        }

        if (orientation !== this.DefOrientation || size[0] !== this.DefPageSize[0] || size[1] !== this.DefPageSize[1]) {

            if (typeof this.PageInfo[this.page] === 'undefined') {
                this.PageInfo[this.page] = new Array()
            }

            this.PageInfo[this.page]['size'] = [this.wPt, this.hPt]
        }

        if (rotation !== 0) {

            if (rotation % 90 != 0) {
                throw 'Incorrect rotation value'
            }

            if (typeof this.PageInfo[this.page] === 'undefined') {
                this.PageInfo[this.page] = new Array()
            }

            this.CurRotation = rotation;
            this.PageInfo[this.page]['rotation'] = $rotation;
        }

    }

    _endpage() {
        this.state = 1
    }

    _loadfont(font) {

        if (font.indexOf("/") !== -1 || font.indexOf("\\") !== -1) {
            throw `Incorrect font definition file name:.`
        }

        const ftn = require(`${this.fontpath}${font}`)
        if (typeof ftn.name === "undefined") {
            throw `Could not include font definition file`
        }

        if (typeof ftn.enc !== "undefined") {
            this.enc = ftn.enc
        }

        if (typeof ftn.subsetted !== "undefined") {
            this.subsetted = ftn.subsetted
        }

        return ftn

    }

    _out(s) {

        // Add a line to the document
        if (this.state === 2) {
            this.pages[this.page] += s + "\n";
        } else if (this.state === 1) {
            this._put(s);
        } else if (this.state === 0) {
            throw 'No page has been added yet'
        } else if (this.state === 3) {
            throw 'The document is closed'
        }

    }

    _put(s) {
        this.buffer += s + "\n"
    }
}

