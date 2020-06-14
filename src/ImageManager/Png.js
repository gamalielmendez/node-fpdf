const zlib =require('zlib')
const PNG =require('png-js');

 class PNGImage {

  constructor(data, label) {
    this.label = label;
    this.image = new PNG(data);
    this.width = this.image.width;
    this.height = this.image.height;
    this.imgData = this.image.imgData;
    this.obj = null;

  }

  embed() {
    let dataDecoded = false;
    if (this.obj) {
      return;
    }

    const hasAlphaChannel = this.image.hasAlphaChannel;
    const isInterlaced = this.image.interlaceMethod === 1;

    this.obj = {
      bpc: hasAlphaChannel ? 8 : this.image.bits,
      w: this.width,
      h: this.height,
      f: 'FlateDecode',
      data:this.image.imgData,
      dp:''
    }

    if (!hasAlphaChannel) {
      const params = {
        Predictor: isInterlaced ? 1 : 15,
        Colors: this.image.colors,
        bpc: this.image.bits,
        Columns: this.width
      }

      this.obj['DecodeParms'] = params;
    }

    if (this.image.palette.length === 0) {
      this.obj['cs'] = this.image.colorSpace;
    } else {
      // embed the color palette in the PDF as an object stream
      //const palette = this.document.ref();
      //palette.end(new Buffer(this.image.palette));
        const palette=Buffer.from(this.image.palette)
      // build the color space array for the image
      this.obj['cs'] = [
        'Indexed',
        'DeviceRGB',
        this.image.palette.length / 3 - 1,
        palette
      ];
    }

    // For PNG color types 0, 2 and 3, the transparency data is stored in
    // a dedicated PNG chunk.
    if (this.image.transparency.grayscale != null) {
      // Use Color Key Masking (spec section 4.8.5)
      // An array with N elements, where N is two times the number of color components.
      const val = this.image.transparency.grayscale;
      this.obj['smask'] = [val, val];
    } else if (this.image.transparency.rgb) {
      // Use Color Key Masking (spec section 4.8.5)
      // An array with N elements, where N is two times the number of color components.
      const { rgb } = this.image.transparency;
      const mask = [];
      for (let x of rgb) {
        mask.push(x, x);
      }
      console.log(':)')
      this.obj['smask'] = mask;
    } else if (this.image.transparency.indexed) {
      // Create a transparency SMask for the image based on the data
      // in the PLTE and tRNS sections. See below for details on SMasks.
      dataDecoded = true;
      return this.loadIndexedAlphaChannel();
    } else if (hasAlphaChannel) {
      // For PNG color types 4 and 6, the transparency data is stored as a alpha
      // channel mixed in with the main image data. Separate this data out into an
      // SMask object and store it separately in the PDF.
      dataDecoded = true;
      return this.splitAlphaChannel();
    }
    


    if (isInterlaced && !dataDecoded) {
      return this.decodeData();
    }
    

    this.finalize();
  }

  finalize() {
    if (this.alphaChannel) {
      const sMask = {
        h: this.height,
        w: this.width,
        bpc: 8,
        f: 'FlateDecode',
        cs: 'DeviceGray',
        Decode: [0, 1]
      }

      this.obj['smask'] = sMask;
    }

    // free memory
    this.image = null;
    return (this.imgData = null);
  }

  splitAlphaChannel() {
    return this.image.decodePixels(pixels => {
      let a, p;
      const colorCount = this.image.colors;
      const pixelCount = this.width * this.height;
      const imgData = new Buffer(pixelCount * colorCount);
      const alphaChannel = new Buffer(pixelCount);

      let i = (p = a = 0);
      const len = pixels.length;
      // For 16bit images copy only most significant byte (MSB) - PNG data is always stored in network byte order (MSB first)
      const skipByteCount = this.image.bits === 16 ? 1 : 0;
      while (i < len) {
        for (let colorIndex = 0; colorIndex < colorCount; colorIndex++) {
          imgData[p++] = pixels[i++];
          i += skipByteCount;
        }
        alphaChannel[a++] = pixels[i++];
        i += skipByteCount;
      }

      this.imgData = zlib.deflateSync(imgData);
      this.alphaChannel = zlib.deflateSync(alphaChannel);
      return this.finalize();
    });
  }

  loadIndexedAlphaChannel() {
    const transparency = this.image.transparency.indexed;
    return this.image.decodePixels(pixels => {
      const alphaChannel = new Buffer(this.width * this.height);

      let i = 0;
      for (let j = 0, end = pixels.length; j < end; j++) {
        alphaChannel[i++] = transparency[pixels[j]];
      }

      this.alphaChannel = zlib.deflateSync(alphaChannel);
      return this.finalize();
    });
  }

  decodeData() {
    this.image.decodePixels(pixels => {
      this.imgData = zlib.deflateSync(pixels);
      this.finalize();
    });
  }
}

module.exports= PNGImage;