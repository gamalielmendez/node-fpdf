
module.exports=class FPDF {

    constructor(orientation='P', unit='mm', size='A4') {
        
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

    }

}

