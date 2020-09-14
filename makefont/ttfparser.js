const fs = require('fs')

module.exports = class ttfparser {

    constructor(file){

        this.f=fs.openSync(file)
        this.position = 0
        if(!this.f){
            this.Error('Can\'t open file: '+file);
        }

    }

    Parse(){

		this.ParseOffsetTable();
		this.ParseHead();
		this.ParseHhea();
		this.ParseMaxp();
		this.ParseHmtx();
		this.ParseLoca();
		//this.ParseGlyf();
		//this.ParseCmap();
		//this.ParseName();
		//this.ParseOS2();
        //this.ParsePost();
        
    }
    
    ParseOffsetTable(){
        
        const version = this.Read(4);
		if(version=='OTTO'){
            this.Error('OpenType fonts based on PostScript outlines are not supported');
        }

        if(version!=="\x00\x01\x00\x00"){
            this.Error('Unrecognized file format');	
        }
        
        const numTables = this.ReadUShort();
        this.Skip(3*2)
        this.tables ={}

        for(let i=0;i<numTables;i++)
		{
            const tag = this.Read(4);
            const checkSum = this.Read(4);
            const offset = this.ReadULong();
            const length = this.ReadULong(4);
          
            this.tables[tag] = {offset,length,checkSum}
            //console.log(this.tables)
		}
        
    }
    
    ParseHead(){

		this.Seek('head');
        this.Skip(3*4); // version, fontRevision, checkSumAdjustment
        
        const magicNumber = this.ReadULong();
        
		if(magicNumber!=0x5F0F3CF5){
            //this.Error('Incorrect magic number');
        }
			
		this.Skip(2); // flags
        this.unitsPerEm = this.ReadUShort();
		this.Skip(2*8); // created, modified
        this.xMin = this.ReadShort();
		this.yMin = this.ReadShort();
		this.xMax = this.ReadShort();
		this.yMax = this.ReadShort();
		this.Skip(3*2); // macStyle, lowestRecPPEM, fontDirectionHint
        this.indexToLocFormat = this.ReadShort();
        
    }
    
    ParseHhea(){
		this.Seek('hhea');
	    this.Skip(4+15*2);
        this.numberOfHMetrics = this.ReadUShort();
    }
    
    ParseMaxp()
	{
		this.Seek('maxp');
		this.Skip(4);
        this.numGlyphs = this.ReadUShort();

    }
    
	ParseHmtx()
	{
		this.Seek('hmtx');
        this.glyphs = [];
        
		for(let i=0;i<this.numberOfHMetrics;i++)
		{
			const advanceWidth = this.ReadUShort();
			const lsb = this.ReadShort();
			this.glyphs[i]={'w':advanceWidth,'lsb':lsb} //[$i] = array('w'=>$advanceWidth, 'lsb'=>$lsb);
        }
        
		for(let i=this.numberOfHMetrics;i<this.numGlyphs;i++)
		{
			const lsb = this.ReadShort();
            this.glyphs[i] ={'w':advanceWidth,'lsb':lsb} //array('w'=>$advanceWidth, 'lsb'=>$lsb);
        }
   
    }
    
    ParseLoca()
	{
		this.Seek('loca');
		let offsets = [];
		if(this.indexToLocFormat===0)
		{
			// Short format
			for(let i=0;i<=this.numGlyphs;i++)
				offsets.push( 2*this.ReadUShort())
		}else
		{
			// Long format
			for(let i=0;i<=this.numGlyphs;i++)
                offsets.push(this.ReadULong())
        }
        
		for(let i=0;i<this.numGlyphs;i++)
		{
			this.glyphs[i]['offset'] = offsets[i];
		    this.glyphs[i]['length'] = offsets[i+1] - offsets[i];
        }

    }
    
    Seek(tag){
        
        if(typeof this.tables[tag] === 'undefined'){
            this.Error('Table not found: '+tag);   
        }
        this.position=this.tables[tag]['offset']

	}

    Skip(n){ this.position+=n }
    
	Read(n){

        if(n>0){
            const buffer = Buffer.alloc ? Buffer.alloc(n) : new Buffer(n);
            const read = fs.readSync(this.f, buffer, 0, n,this.position);
            this.position+=n
            return buffer.toString('ascii')
        }else{
            return 0
        }

	}

	ReadUShort(){

        const buffer = Buffer.alloc ? Buffer.alloc(2) : new Buffer(n);
        const read = fs.readSync(this.f, buffer, 0, 2);
        this.position+=2
        return buffer.readUInt16LE()

    }
    
    ReadShort(){
        
        const buffer = Buffer.alloc ? Buffer.alloc(2) : new Buffer(n);
        const read = fs.readSync(this.f, buffer, 0, 2);
        this.position+=2
        let a= buffer.readUInt16LE()
        
        if(a>=0x8000){
            a -= 65536;
        }
			
		return a
    }
    

    ReadULong()
	{
        const buffer = Buffer.alloc ? Buffer.alloc(4) : new Buffer(n);
        const read = fs.readSync(this.f, buffer, 0, 4);
        this.position+=4
        return buffer.readUInt32LE()

    }
    
    Error(msg) { throw 'ttfparser error: ' + msg }

}