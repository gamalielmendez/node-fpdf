
const fs = require('fs')
const sprintf = require('sprintf-js').sprintf

function substr_count(target, textSearch) {
    const substr_count = target.split(textSearch).length - 1;
    return substr_count
}

module.exports = class FPDF {

    constructor(orientation = 'P', unit = 'mm', size = 'A4', fontpath = "") {

        // Initialization of properties
        this.state = 0;
        this.page = 0;
        this.n = 2;
        this.buffer = '';
        this.pages = new Array();
        this.PageInfo = new Array();
        this.fonts = {};
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
        this.PageLinks = {}
        this.AliasNbPages = ''
        this.offsets = {}
        this.metadata = {}
        this.ZoomMode = ''

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
        info['i'] = (Object.keys(this.fonts).length + 1)

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

    Cell(w, h = 0, txt = '', border = 0, ln = 0, align = '', fill = false, link = '') {

        // Output a cell
        const k = this.k;
        let x, y, ws

        if (this.y + h > this.PageBreakTrigger && this.InHeader && this.InFooter && this.AcceptPageBreak()) {
            // Automatic page break
            x = this.x;
            ws = this.ws;
            if (ws > 0) {
                this.ws = 0;
                this._out('0 Tw');
            }

            this.AddPage(this.CurOrientation, this.CurPageSize, this.CurRotation);
            this.x = x;
            if (ws > 0) {
                this.ws = ws;
                this._out(sprintf('%.3f Tw', ws * k));
            }
        }

        if (w === 0) { w = this.w - this.rMargin - this.x }
        let s = '';

        if (typeof border === 'number') {

            if (fill || border === 1) {

                let op
                if (fill) {
                    op = (border == 1) ? 'B' : 'f';
                } else {
                    op = 'S';
                }

                s = sprintf('%.2f %.2f %.2f %.2f re %s ', this.x * k, (this.h - this.y) * k, w * k, -h * k, op);

            }

        } else if (typeof border === 'string') {

            x = this.x;
            y = this.y;

            if (border.indexOf('L') !== -1) {
                s += sprintf('%.2f %.2f m %.2f %.2f l S ', x * k, (this.h - y) * k, x * k, (this.h - (y + h)) * k);
            }

            if (border.indexOf('T') !== -1) {
                s += sprintf('%.2f %.2f m %.2f %.2f l S ', x * k, (this.h - y) * k, (x + w) * k, (this.h - y) * k);
            }

            if (border.indexOf('R') !== -1) {
                s += sprintf('%.2f %.2f m %.2f %.2f l S ', (x + w) * k, (this.h - y) * k, (x + w) * k, (this.h - (y + h)) * k);
            }

            if (border.indexOf('B') !== -1) {
                s += sprintf('%.2f %.2f m %.2f %.2f l S ', x * k, (this.h - (y + h)) * k, (x + w) * k, (this.h - (y + h)) * k);
            }

        }

        if (txt !== '') {

            if (typeof this.CurrentFont === 'undefined') {
                throw 'No font has been set'
            }

            let dx
            if (align === 'R') {
                dx = w - this.cMargin - this.GetStringWidth(txt);
            } else if (align === 'C') {
                dx = (w - this.GetStringWidth(txt)) / 2;
            } else {
                dx = this.cMargin;
            }

            if (this.ColorFlag) { s += 'q ' + this.TextColor + ' ' }

            s += sprintf('BT %.2f %.2f Td (%s) Tj ET', (this.x + dx) * k, (this.h - (this.y + 0.5 * h + 0.3 * this.FontSize)) * k, this._escape(txt));

            if (this.underline) { s += ' ' + this._dounderline(this.x + dx, this.y + 0.5 * h + 0.3 * this.FontSize, txt) }
            if (this.ColorFlag) { s += ' Q' }
            if (link !== '') { this.Link(this.x + dx, this.y + 0.5 * h - 0.5 * this.FontSize, this.GetStringWidth(txt), this.FontSize, link) }

        }

        if (s) { this._out(s) }
        this.lasth = h;

        if (ln > 0) {

            // Go to next line
            this.y += h;
            if (ln == 1) {
                this.x = this.lMargin;
            }

        } else {
            this.x += w;
        }

    }

    Close() {

        // Terminate document
        if (this.state == 3) { return }
        if (this.page == 0) { this.AddPage() }

        // Page footer
        this.InFooter = true;
        this.Footer();
        this.InFooter = false;

        // Close page
        this._endpage();
        // Close document
        this._enddoc();

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
        if (typeof this.PageInfo[this.page] === 'undefined') {
            this.PageInfo[this.page] = {}
        }
        if (orientation !== this.DefOrientation || size[0] !== this.DefPageSize[0] || size[1] !== this.DefPageSize[1]) {

            this.PageInfo[this.page]['size'] = [this.wPt, this.hPt]
        }

        if (rotation !== 0) {

            if (rotation % 90 != 0) {
                throw 'Incorrect rotation value'
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

    AcceptPageBreak() {
        // Accept automatic page break or not
        return this.AutoPageBreak;
    }

    GetStringWidth(s) {

        // Get width of a string in the current font
        s = `${s}`;
        const cw = this.CurrentFont['cw']
        let w = 0
        const l = s.length

        for (let index = 0; index < l; index++) {
            w += cw[s.charAt(index)]
        }

        return w * this.FontSize / 1000
    }

    _escape(s) {
        // Escape special characters
        s=`${s}`
        return s.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\\/g, '\\\\');
    }

    _dounderline(x, y, txt) {
        // Underline text
        const up = this.CurrentFont['up'];
        const ut = this.CurrentFont['ut'];
        const w = this.GetStringWidth(txt) + this.ws * substr_count(txt, ' ');
        return sprintf('%.2f %.2f %.2f %.2f re f', x * this.k, (this.h - (y - up / 1000 * this.FontSize)) * this.k, w * this.k, -ut / 1000 * this.FontSizePt);
    }

    Link(x, y, w, h, link) {
        // Put a link on the page
        this.PageLinks[this.page] = [x * this.k, this.hPt - y * this.k, w * this.k, h * this.k, link];
    }

    _getoffset() {
        return this.buffer.length
    }

    _newobj(n) {
        // Begin a new object
        if (typeof n === 'undefined') { n = ++this.n; }
        this.offsets[n] = this._getoffset();
        this._put(`${n} 0 obj`);

    }

    _putstream(data) {
        this._put('stream');
        this._put(data);
        this._put('endstream');
    }

    _putstreamobject(data) {

        let entries
        if (this.compress) {
            entries = '/Filter /FlateDecode ';
            data = gzcompress(data);
        } else {
            entries = '';
        }

        entries += `/Length ${data.length}`;
        this._newobj();
        this._put('<<' + entries + '>>');
        this._putstream(data);
        this._put('endobj');
    }

    _putpage(n) {

        this._newobj()
        this._put('<</Type /Page')
        this._put('/Parent 1 0 R')

        if (typeof this.PageInfo[n]['size'] !== 'undefined') {
            this._put(sprintf('/MediaBox [0 0 %.2f %.2f]', this.PageInfo[n]['size'][0], this.PageInfo[n]['size'][1]))
        }

        if (typeof this.PageInfo[n]['rotation'] !== 'undefined') {
            this._put(`/Rotate ${this.PageInfo[n]['rotation']}`);
        }

        this._put('/Resources 2 0 R');
        if (typeof this.PageLinks[n] !== 'undefined') {

            // Links
            let annots = '/Annots [';
            this.PageLinks[n].forEach(pl => {

                const rect = sprintf('%.2f %.2f %.2f %.2f', pl[0], pl[1], pl[0] + pl[2], pl[1] - pl[3]);
                annots += '<</Type /Annot /Subtype /Link /Rect [' + $rect + '] /Border [0 0 0] ';

                if (typeof pl[4] === 'string') {
                    annots += '/A <</S /URI /URI ' + $this._textstring($pl[4]) + '>>>>';
                } else {

                    const l = this.links[pl[4]]
                    let h
                    if (typeof this.PageInfo[l][0]['size'] !== 'undefined') {
                        h = this.PageInfo[l[0]]['size'][1];
                    } else {
                        h = (this.DefOrientation == 'P') ? this.DefPageSize[1] * this.k : this.DefPageSize[0] * this.k;
                    }

                    annots += sprintf('/Dest [%d 0 R /XYZ 0 %.2f null]>>', this.PageInfo[l[0]]['n'], h - l[1] * this.k);
                }

            });

            this._put(annots + ']');
        }

        if (this.WithAlpha) {
            this._put('/Group <</Type /Group /S /Transparency /CS /DeviceRGB>>');
        }

        this._put(`/Contents ${(this.n + 1)} 0 R>>`);
        this._put('endobj')

        // Page content
        if (this.AliasNbPages !== '') {
            this.pages[n] = this.pages[n].replace(this.AliasNbPages, this.page)
        }

        this._putstreamobject(this.pages[n]);

    }

    _putheader() {
        this._put('%PDF-' + this.PDFVersion);
    }

    _putpages() {

        const nb = this.page;
        for (let n = 1; n <= nb; n++) {
            this.PageInfo[n]['n'] = this.n + 1 + 2 * (n - 1);
        }

        for (let n = 1; n <= nb; n++) {
            this._putpage(n);
        }

        // Pages root
        this._newobj(1);
        this._put('<</Type /Pages');

        let kids = '/Kids [';
        for (let n = 1; n <= nb; n++) {
            kids += `${this.PageInfo[n]['n']} 0 R `;
        }

        this._put(kids + ']');
        this._put(`/Count ${nb}`);

        let w
        let h
        if (this.DefOrientation == 'P') {
            w = this.DefPageSize[0];
            h = this.DefPageSize[1];
        } else {
            w = this.DefPageSize[1];
            h = this.DefPageSize[0];
        }

        this._put(sprintf('/MediaBox [0 0 %.2f %.2f]', w * this.k, h * this.k));
        this._put('>>');
        this._put('endobj');

    }

    _tounicodecmap(uv) {

        let ranges = ''
        let nbr = 0
        let chars = ''
        let nbc = 0

        for (const key in uv) {

            if (typeof uv[key] === 'number') {
                chars += sprintf("<%02X> <%04X>\n", key, uv[key])
                nbc++
            } else {
                ranges += sprintf("<%02X> <%02X> <%04X>\n", key, key + uv[key][1] - 1, uv[key][0]);
                nbr++;
            }

        }

        let $s = "/CIDInit /ProcSet findresource begin\n";
        $s += "12 dict begin\n";
        $s += "begincmap\n";
        $s += "/CIDSystemInfo\n";
        $s += "<</Registry (Adobe)\n";
        $s += "/Ordering (UCS)\n";
        $s += "/Supplement 0\n";
        $s += ">> def\n";
        $s += "/CMapName /Adobe-Identity-UCS def\n";
        $s += "/CMapType 2 def\n";
        $s += "1 begincodespacerange\n";
        $s += "<00> <FF>\n";
        $s += "endcodespacerange\n";

        if (nbr > 0) {
            $s += `${nbr} beginbfrange\n`;
            $s += ranges;
            $s += "endbfrange\n";
        }

        if (nbc > 0) {
            $s += `${nbc} beginbfchar\n`;
            $s += chars;
            $s += "endbfchar\n";
        }

        $s += "endcmap\n";
        $s += "CMapName currentdict /CMap defineresource pop\n";
        $s += "end\n";
        $s += "end";

        return $s;

    }

    _putfonts() {

        //soporte para fuentes enbebidas pendiente
        this.FontFiles.forEach(file => { });

        for (const key in this.fonts) {

            const font = this.fonts[key]

            // Encoding
            if (typeof font['diff'] !== 'undefined') {
                if (typeof this.encodings[font['enc']] === 'undefined') {
                    this._newobj();
                    this._put(`<</Type /Encoding /BaseEncoding /WinAnsiEncoding /Differences [${font['diff']}]>>`);
                    this._put('endobj');
                    this.encodings[font['enc']] = this.n;
                }
            }

            // ToUnicode CMap
            let cmapkey
            if (typeof font['uv'] !== 'undefined') {
                if (typeof font['enc'] !== 'undefined') {
                    cmapkey = font['enc']
                } else {
                    cmapkey = font['name']
                }

                if (typeof this.cmaps[cmapkey] === 'undefined') {
                    const cmap = this._tounicodecmap(font['uv']);
                    this._putstreamobject(cmap);
                    this.cmaps[cmapkey] = this.n;
                }
            }

            // Font object
            this.fonts[key]['n'] = this.n + 1;
            const type = font['type'];
            let name = font['name'];
            if (font['subsetted']) { name = 'AAAAAA+' + name }

            if (type == 'Core') {

                // Core font
                this._newobj();
                this._put('<</Type /Font');
                this._put('/BaseFont /' + name);
                this._put('/Subtype /Type1');

                if (name !== 'Symbol' && name !== 'ZapfDingbats') { this._put('/Encoding /WinAnsiEncoding') }
                if (typeof font['uv'] !== 'undefined') { this._put(`/ToUnicode ${this.cmaps[cmapkey]} 0 R`) }

                this._put('>>');
                this._put('endobj');

            } else if (type === 'Type1' || type === 'TrueType') {

                // Additional Type1 or TrueType/OpenType font
                this._newobj();
                this._put('<</Type /Font');
                this._put('/BaseFont /' + name);
                this._put('/Subtype /' + type);
                this._put('/FirstChar 32 /LastChar 255');
                this._put(`/Widths ${this.n + 1} 0 R`);
                this._put(`/FontDescriptor ${this.n + 2} 0 R`);

                if (typeof font['diff'] !== 'undefined') {
                    this._put(`/Encoding ${this.encodings[font['enc']]} 0 R`);
                } else {
                    this._put('/Encoding /WinAnsiEncoding');
                }
                //isset($font['uv'])   
                if (typeof font['uv'] !== 'undefined') {
                    this._put(`/ToUnicode ${this.cmaps[$mapkey]} 0 R`);
                }

                this._put('>>');
                this._put('endobj');
                // Widths
                this._newobj();
                const cw = font['cw'];
                let s = '[';
                for (let $i = 32; $i <= 255; $i++) {
                    s += `${cw[String.fromCharCode($i)]} `;
                }

                this._put(s + ']');
                this._put('endobj');

                // Descriptor
                this._newobj();
                s = '<</Type /FontDescriptor /FontName /' + $name;

                for (const key2 in font['desc']) {
                    s += ` /${key2} ${font['desc'][key2]}`;
                }

                if (!empty($font['file'])) {
                    s += ` /FontFile${(type == 'Type1') ? '' : '2'} ${this.FontFiles[font['file']]['n']} 0 R`
                }

                this._put(s + '>>');
                this._put('endobj');

            } else {
                // Allow for additional types
                let mtd = '_put' + type.toLowerCase()
                if (typeof this[mtd] === 'undefined') {
                    throw 'Unsupported font type: '
                }
                this[mtd](font);
            }
        }

    }

    _putimages() {
        /*   
        foreach(array_keys($this->images) as $file){
            $this->_putimage($this->images[$file]);
            unset($this->images[$file]['data']);
            unset($this->images[$file]['smask']);
        }
        */
    }

    _putxobjectdict() {

        for (const key in this.images) {
            const image = this.images[key]
            this._put(`/I${image['i']} ${image['n']} 0 R`);
        }

    }

    _putresourcedict() {

        this._put('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
        this._put('/Font <<');

        for (const key in this.fonts) {
            const font = this.fonts[key]
            this._put(`/F${font['i']} ${font['n']} 0 R`);
        }

        this._put('>>');
        this._put('/XObject <<');
        this._putxobjectdict();
        this._put('>>');
    }

    _putresources() {

        this._putfonts();
        //this._putimages();
        // Resource dictionary
        this._newobj(2);
        this._put('<<');
        this._putresourcedict();
        this._put('>>');
        this._put('endobj');

    }

    _putinfo() {

        this.metadata['Producer'] = 'FPDF ' + this.PDFVersion;
        var date = new Date();
        var YYYYMMDDHHMMSS = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
        this.metadata['CreationDate'] = "D:" + YYYYMMDDHHMMSS


        for (const key in this.metadata) {
            const value = this.metadata[key]
            this._put(`/${key} ${this._textstring(value)}`);
        }

    }

    _putcatalog() {

        const n = this.PageInfo[1]['n'];
        this._put('/Type /Catalog');
        this._put('/Pages 1 0 R');

        if (this.ZoomMode === 'fullpage') {
            this._put(`/OpenAction [${n} 0 R /Fit]`);
        } else if (this.ZoomMode === 'fullwidth') {
            this._put(`/OpenAction [${n} 0 R /FitH null]`);
        } else if (this.ZoomMode === 'real') {
            this._put(`/OpenAction [${n} 0 R /XYZ null null 1]`);
        } else if (typeof this.ZoomMode !== 'string') {
            this._put(`/OpenAction [${n} 0 R /XYZ null null ${sprintf('%.2f', this.ZoomMode / 100)}]`);
        }

        if (this.LayoutMode === 'single') {
            this._put('/PageLayout /SinglePage');
        } else if (this.LayoutMode === 'continuous') {
            this._put('/PageLayout /OneColumn');
        } else if (this.LayoutMode === 'two') {
            this._put('/PageLayout /TwoColumnLeft');
        }

    }

    _puttrailer() {
        this._put(`/Size ${this.n + 1}`);
        this._put(`/Root ${this.n} 0 R`);
        this._put(`/Info ${this.n - 1} 0 R`);
    }

    _enddoc() {

        this._putheader();
        this._putpages();
        this._putresources();

        // Info
        this._newobj();
        this._put('<<');
        this._putinfo();
        this._put('>>');
        this._put('endobj');
        // Catalog
        this._newobj();
        this._put('<<');
        this._putcatalog();
        this._put('>>');
        this._put('endobj');
        // Cross-ref
        const offset = this._getoffset();
        this._put('xref');
        this._put(`0 ${(this.n + 1)}`);
        this._put('0000000000 65535 f ');
        for (let i = 1; i <= this.n; i++) {
            this._put(sprintf('%010d 00000 n ', this.offsets[i]));
        }

        // Trailer
        this._put('trailer');
        this._put('<<');
        this._puttrailer();
        this._put('>>');
        this._put('startxref');
        this._put(`${offset}`);
        this._put('%%EOF');
        this.state = 3;
    }

    Output(xdest = 'F', xfile = 'doc.pdf') {

        if (this.state < 3) this.Close();


        switch (xdest.toLowerCase()) {
            case 'f':
                fs.writeFileSync(xfile, this.buffer);
                break;
            case 's':
                //console.log(this.buffer)
                return this.buffer;
                break;
            default:
                throw 'ERROR -- Unrecognized output type: "' + xdest + '", options are I (in browser), D (download through browser), F (write to file), or S (return as a string).'
        }
    }

    _textstring(xs) {
        return "(" + this._escape(xs) + ")";
    }

    GetPageHeight() {
        // Get current page height
        return this.h;
    }

    GetPageWidth() {
        // Get current page width
        return this.w;
    }

    GetX() {
        // Get x position
        return this.x;
    }

    GetY() {
        // Get y position
        return this.y;
    }

    SetXY(x, y) {
        // Set x and y positions
        this.SetX(x);
        this.SetY(y, false);
    }

    SetX(x) {
        // Set x position
        if (x >= 0)
            this.x = x;
        else
            this.x = this.w + x;
    }
    
    SetY(y, resetX=true){
        // Set y position and optionally reset x
        if(y>=0)
            this.y = y;
        else
            this.y = this.h+y;
        
        if(resetX)
            this.x = this.lMargin;
    }
    
    SetTopMargin(margin){
        // Set top margin
        this.tMargin = margin;
    }

    SetTitle(title){
	    // Title of document
	    this.metadata['Title']=title
    }

    SetTextColor(r, g=null, b=null){
        // Set color for text
        if((r==0 && g==0 && b==0) || g===null){
            this.TextColor = sprintf('%.3f g',r/255);
        }else{
            this.TextColor = sprintf('%.3f %.3f %.3f rg',r/255,g/255,b/255);
        }
           
        this.ColorFlag = (this.FillColor!==this.TextColor);
    }

    SetFontSize(size){
        // Set font size in points
        if(this.FontSizePt===size)
            return;

        this.FontSizePt = size;
        this.FontSize = size/this.k;
        
        if(this.page>0)
            this._out(sprintf('BT /F%d %.2f Tf ET',this.CurrentFont['i'],this.FontSizePt));
    }

    SetAuthor(author){
        // Author of document
        this.metadata['Author'] = author
    }

    SetCreator(creator){
        // Creator of document
        this.metadata['Creator'] = creator
    }

    SetKeywords(keywords){
        // Keywords of document
        this.metadata['Keywords'] = keywords
    }

    SetLeftMargin(margin){
        // Set left margin
        this.lMargin = margin;
        if(this.page>0 && this.x<margin)
            this.x = margin;
    }

    SetLineWidth(width){

        // Set line width
        this.LineWidth = width;
        if(this.page>0)
            this._out(sprintf('%.2f w',width*this.k));

    }

    SetLink(link, y=0, page=-1){
        // Set destination of internal link
        if(y==-1)
            y = this.y;

        if(page==-1)
            page = this.page;

        this.links[link] = [page,y]
    }

    SetMargins(left, top, right=null){
        // Set left, top and right margins
        this.lMargin = left;
        this.tMargin = top;
        
        if(right===null)
            right = left;

        this.rMargin = right;
    }

    SetRightMargin(margin){
        // Set right margin
        this.rMargin = margin;
    }

    SetSubject(subject){
        // Subject of document
        this.metadata['Subject'] = subject
    }

    Ln(h=null){
        // Line feed; default value is the last cell height
        this.x = this.lMargin;
        if(h===null)
            this.y += this.lasth;
        else
            this.y += h;
    }

    
    Text(x, y, txt){
        
        // Output a string
        if(typeof this.CurrentFont ==='undefined')
            throw 'No font has been set'    
 
        let s = sprintf('BT %.2f %.2f Td (%s) Tj ET',x*this.k,(this.h-y)*this.k,this._escape(txt));
        if(this.underline && txt!=='')
            s += ' '+this._dounderline(x,y,txt);

        if(this.ColorFlag)
            s = 'q '+this.TextColor+' '+s+' Q';

        this._out(s);

    }

    SetDrawColor(r, g=null, b=null){
        // Set color for all stroking operations
        if((r==0 && g==0 && b==0) || g===null)
            this.DrawColor = sprintf('%.3f G',r/255);
        else
            this.DrawColor = sprintf('%.3f %.3f %.3f RG',r/255,g/255,b/255);
        
        if(this.page>0)
            this._out(this.DrawColor);
    }

    SetFillColor(r, g=null, b=null){
        // Set color for all filling operations
        if((r==0 && g==0 && b==0) || g===null)
            this.FillColor = sprintf('%.3f g',r/255);
        else
            this.FillColor = sprintf('%.3f %.3f %.3f rg',r/255,g/255,b/255);
        
        this.ColorFlag = (this.FillColor!=this.TextColor);
        if(this.page>0)
            this._out(this.FillColor);
    }

    PageNo(){
        // Get current page number
        return this.page;
    }
    
    Line(x1, y1, x2, y2){
        // Draw a line
        this._out(sprintf('%.2f %.2f m %.2f %.2f l S',x1*this.k,(this.h-y1)*this.k,x2*this.k,(this.h-y2)*this.k));
    }

    Rect(x, y, w, h, style=''){
        // Draw a rectangle
        let op
        if(style==='F')
            op = 'f';
        else if(style==='FD' || style==='DF')
            op = 'B';
        else
            op = 'S';

        this._out(sprintf('%.2f %.2f %.2f %.2f re %s',x*this.k,(this.h-y)*this.k,w*this.k,-h*this.k,op));
    }
}

