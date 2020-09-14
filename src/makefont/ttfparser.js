/*******************************************************************************
* Class to parse and subset TrueType fonts                                     *
*                                                                              *
* Version: 1.1                                                                 *
* Date:    2015-11-29                                                          *
* Author original:  Olivier PLATHEY                                            *
* Author port:  Gamaliel Mendez Hernandez                                      *
*******************************************************************************/

const fs = require('fs')
const { fopen, fread, isset, fseek } = require('../PHP_CoreFunctions')

class TTFParser {

    constructor(filename) {

        //se inicializan las variables de la clase
        this.tables = {}
        this.glyphs = {}

        this.f = fopen(filename, 'rb');
        if (!this.f) {
            this.Error('Can\'t open file: ' + filename);
        }

    }

    Parse() {

        this.ParseOffsetTable();
        this.ParseHead();
        this.ParseHhea();
        this.ParseMaxp();
        this.ParseHmtx();
        this.ParseLoca();
        this.ParseGlyf();
		this.ParseCmap();
		/*this.ParseName();
		this.ParseOS2();
        this.ParsePost();*/

    }

    ParseOffsetTable() {
        const version = this.Read(4).toString('binary')
        if (version === 'OTTO') {
            this.Error('OpenType fonts based on PostScript outlines are not supported');
        }

        if (version !== "\x00\x01\x00\x00") {
            this.Error('Unrecognized file format');
        }


        const numTables = this.ReadUShort();
        this.Skip(3 * 2); // searchRange, entrySelector, rangeShift
        this.tables = {};
        for (let i = 0; i < numTables; i++) {
            const tag = this.Read(4);
            const checkSum = this.Read(4);
            const offset = this.ReadULong();
            const length = this.ReadULong(4);
            this.tables[tag] = { 'offset': offset, 'length': length, 'checkSum': checkSum }
        }

    }

    ParseHead() {

        this.Seek('head');
        this.Skip(3 * 4); // version, fontRevision, checkSumAdjustment
        let magicNumber = this.ReadULong();
        if (magicNumber !== 0x5F0F3CF5) {
            this.Error('Incorrect magic number');
        }

        this.Skip(2); // flags
        this.unitsPerEm = this.ReadUShort();
        this.Skip(2 * 8); // created, modified
        this.xMin = this.ReadShort();
        this.yMin = this.ReadShort();
        this.xMax = this.ReadShort();
        this.yMax = this.ReadShort();
        this.Skip(3 * 2); // macStyle, lowestRecPPEM, fontDirectionHint
        this.indexToLocFormat = this.ReadShort();

    }

    ParseHhea() {

        this.Seek('hhea');
        this.Skip((4 + 15 * 2));
        this.numberOfHMetrics = this.ReadUShort();
        console.log(this.numberOfHMetrics)
    }

    ParseMaxp() {
        this.Seek('maxp');
        this.Skip(4);
        this.numGlyphs = this.ReadUShort();
    }

    ParseHmtx() {

        this.Seek('hmtx');
        this.glyphs = {}
        let advanceWidth
        let lsb

        for (let i = 0; i < this.numberOfHMetrics; i++) {
            advanceWidth = this.ReadUShort();
            lsb = this.ReadShort();
            this.glyphs[i] = { 'w': advanceWidth, 'lsb': lsb };
        }

        for (let i = this.numberOfHMetrics; i < this.numGlyphs; i++) {
            lsb = this.ReadShort();
            this.glyphs[i] = { 'w': advanceWidth, 'lsb': lsb };
        }

    }

    ParseLoca() {

        this.Seek('loca');
        let offsets = []
        if (this.indexToLocFormat === 0) {
            // Short format
            for (let i = 0; i <= this.numGlyphs; i++)
                offsets.push(2 * this.ReadUShort())
        }
        else {
            // Long format
            for (let i = 0; i <= this.numGlyphs; i++)
                offsets.push(this.ReadULong())
        }

        for (let i = 0; i < this.numGlyphs; i++) {
            this.glyphs[i]['offset'] = offsets[i];
            this.glyphs[i]['length'] = offsets[i + 1] - offsets[i];
        }

    }

    ParseGlyf() {

        let tableOffset = this.tables['glyf']['offset'];

        for (const key in this.glyphs) {
            
            if (this.glyphs[key]['length'] > 0) {
                fseek(this.f, tableOffset + this.glyphs[key]['offset'], 'SEEK_SET');
                if (this.ReadShort() < 0) {
                    // Composite glyph
                    this.Skip(4 * 2); // xMin, yMin, xMax, yMax
                    let offset = 5 * 2;
                    let a = {}

                    do {
                        const flags = this.ReadUShort();
                        const index = this.ReadUShort();
                        a[offset + 2] = index;
                        let skip

                        if (flags & 1) { // ARG_1_AND_2_ARE_WORDS
                            skip = 2 * 2;
                        } else {
                            skip = 2;
                        }


                        if (flags & 8) { // WE_HAVE_A_SCALE
                            skip += 2;
                        } else if (flags & 64) { // WE_HAVE_AN_X_AND_Y_SCALE
                            skip += 2 * 2;
                        } else if (flags & 128) { // WE_HAVE_A_TWO_BY_TWO
                            skip += 4 * 2;
                        }

                        this.Skip(skip);
                        offset += 2 * 2 + skip;
                    }
                    while (flags & 32); // MORE_COMPONENTS
                    this.glyphs[key]['components'] = a;
                }
            }
        }
  
    }

    ParseCmap(){

		this.Seek('cmap');
        this.Skip(2); // version
        
		const numTables = this.ReadUShort();
        let offset31 = 0;
     
		for(let i=0;i<numTables;i++)
		{
			const platformID = this.ReadUShort();
			const encodingID = this.ReadUShort();
            const offset     = this.ReadULong();
			if(platformID===3 && encodingID===1){
                offset31 = offset;
            }
				
		}
        
        if(offset31===0){
            this.Error('No Unicode encoding found');
        }
			
        
		let startCount = {};
		let endCount = {};
		let idDelta = {};
		let idRangeOffset = {};
        this.chars = [];
        
		/*fseek($this->f, $this->tables['cmap']['offset']+$offset31, SEEK_SET);
		$format = $this->ReadUShort();
		if($format!=4)
			$this->Error('Unexpected subtable format: '.$format);
		$this->Skip(2*2); // length, language
		$segCount = $this->ReadUShort()/2;
		$this->Skip(3*2); // searchRange, entrySelector, rangeShift
		for($i=0;$i<$segCount;$i++)
			$endCount[$i] = $this->ReadUShort();
		$this->Skip(2); // reservedPad
		for($i=0;$i<$segCount;$i++)
			$startCount[$i] = $this->ReadUShort();
		for($i=0;$i<$segCount;$i++)
			$idDelta[$i] = $this->ReadShort();
		$offset = ftell($this->f);
		for($i=0;$i<$segCount;$i++)
			$idRangeOffset[$i] = $this->ReadUShort();

		for($i=0;$i<$segCount;$i++)
		{
			$c1 = $startCount[$i];
			$c2 = $endCount[$i];
			$d = $idDelta[$i];
			$ro = $idRangeOffset[$i];
			if($ro>0)
				fseek($this->f, $offset+2*$i+$ro, SEEK_SET);
			for($c=$c1;$c<=$c2;$c++)
			{
				if($c==0xFFFF)
					break;
				if($ro>0)
				{
					$gid = $this->ReadUShort();
					if($gid>0)
						$gid += $d;
				}
				else
					$gid = $c+$d;
				if($gid>=65536)
					$gid -= 65536;
				if($gid>0)
					$this->chars[$c] = $gid;
			}
		}*/
    }
    
    Seek(tag) {

        if (!isset(this.tables[tag])) {
            this.Error('Table not found: ' + tag);
        }

        fseek(this.f, this.tables[tag]['offset'], 'SEEK_SET')
    }

    Skip(n) {
        fseek(this.f, n, 'SEEK_CUR');
    }

    Read(n) {
        return n > 0 ? fread(this.f, n) : '';
    }

    ReadUShort() {
        const a = fread(this.f, 2)
        return a.readUInt16BE()
    }


    ReadShort() {
        let v = fread(this.f, 2).readUInt16BE()
        if (v >= 0x8000) {
            v -= 65536;
        }

        return v;
    }

    ReadULong() {
        const a = fread(this.f, 4)
        return a.readUInt32BE()
    }

	Error(msg)
	{
		throw msg;
	}
}

module.exports = TTFParser