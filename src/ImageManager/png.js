const { chr, ord, str_replace, substr, function_exists, gzcompress, gzuncompress } = require('../PHP_CoreFunctions')
const customReadBuffer = require('./customReadBuffer')
const fs = require('fs')

const LoadPng = (src) => {

    let imagedata

    if (Buffer.isBuffer(src)) {
        imagedata = src;
    } else if (src instanceof ArrayBuffer) {
        imagedata = Buffer.from(new Uint8Array(src));
    } else {
        let match;
        if ((match = /^data:.+;base64,(.*)$/.exec(src))) {
            imagedata = Buffer.from(match[1], 'base64');
        } else {
            imagedata = fs.readFileSync(src);
            if (!imagedata) {
                return;
            }
        }
    }

    const imageReader = new customReadBuffer(imagedata)

    // Check signature
    const signature = imageReader.readEncodeData(8)
    if (signature !== `${chr(137)}PNG${chr(13)}${chr(10)}${chr(26)}${chr(10)}`) {
        throw 'Not a PNG file: ' + src
    }

    // Read header chunk
    imageReader.skip(4)
    const header = imageReader.readEncodeData(4)
    if (header !== 'IHDR') {
        throw 'Incorrect PNG file: ' + file
    }
    
    const w = imageReader.readint();
    const h = imageReader.readint();
 
    const bpc = ord(imageReader.readEncodeData(1));
    if (bpc > 8) {
        throw '16-bit depth not supported: ' + file
    }

    const ct = ord(imageReader.readEncodeData(1));
 
    let colspace
    if (ct === 0 || ct === 4) {
        colspace = 'DeviceGray';
    } else if (ct === 2 || ct === 6) {
        colspace = 'DeviceRGB';
    } else if (ct === 3) {
        colspace = 'Indexed';
    } else {
        throw 'Unknown color type: ' + file
    }

    if (ord(imageReader.readEncodeData(1)) !== 0) {
        throw 'Unknown compression method: ' + file
    }

    if (ord(imageReader.readEncodeData(1)) !== 0) {
        throw 'Unknown filter method: ' + file
    }

    if (ord(imageReader.readEncodeData(1)) !== 0) {
        throw 'Interlacing not supported: ' + file
    }


    imageReader.skip(4)
    const dp = `/Predictor 15 /Colors ${(colspace == 'DeviceRGB' ? 3 : 1)} /BitsPerComponent ${bpc} /Columns ${w}`;

    // Scan chunks looking for palette, transparency and image data
    let pal = '';
    let trns = '';
    let data = '';
    let n

    do {

        n = imageReader.readint();
        const type = imageReader.readEncodeData(4)//readstream(imagedata, 4, true);

        if (type === 'PLTE') {
            // Read palette
            pal = imageReader.readEncodeData(n);
            imageReader.skip(4)

        } else if (type === 'tRNS') {
            // Read transparency info
            let t = imageReader.readEncodeData(n);
            if (ct === 0) {
                trns = [ord(substr(t, 1, 1))]
            } else if (ct == 2) {
                trns = [ord(substr(t, 1, 1)), ord(substr(t, 3, 1)), ord(substr(t, 5, 1))];
            } else {

                const pos = strpos(t, chr(0));
                if (pos !== -1) {
                    trns = [pos];
                }

            }

            imageReader.skip(4)

        } else if (type === 'IDAT') {

            // Read image data block
            data += imageReader.readEncodeData(n);
            imageReader.skip(4)

        } else if (type == 'IEND') {
            break;
        } else {
            imageReader.skip(n + 4)
            //readstream(imagedata, n + 4);
        }

    } while (n);

    if (colspace == 'Indexed' && !pal) {
        throw 'Missing palette in ' + file
    }

    let info = { 'w': w, 'h': h, 'cs': colspace, 'bpc': bpc, 'f': 'FlateDecode', 'dp': dp, 'pal': pal, 'trns': trns };

    if (ct >= 4) {

        // Extract alpha channel
        if (!function_exists('zlib')) {
            throw 'Zlib not available, can\'t handle alpha channel: ' + file
        }

        data = gzuncompress(data);
        let color = '';
        let alpha = '';

        if (ct === 4) {
            // Gray image
            let len = 2 * w;
            for (let i = 0; i < h; i++) {
                let pos = (1 + len) * i;
                color += data[pos];
                alpha += data[pos];

                let line = substr(data, pos + 1, len);
                color += str_replace(/(.)./s, '$1', line) //line.replace(/(.)./s,'$1');
                alpha += str_replace(/(.)./s, '$1', line)  //line.replace(/.(.)/s,'$1');
            }

        } else {
            // RGB image
            let len = 4 * w;
            for (let i = 0; i < h; i++) {
                let pos = (1 + len) * i;
                color += data[pos]
                alpha += data[pos]

                let line = substr(data, pos + 1, len);

                color += str_replace(/(.{3})./s, '$1', line) //line.replace(,'$1');
                alpha += str_replace(/(.{3})./s, '$1', line) //line.replace(/.{3}(.)/s,'$1');

            }
        }

        data = undefined
        data = gzcompress(color);
        info['smask'] = gzcompress(alpha);
        this.WithAlpha = true;

        info['PDFVersion'] = 1.4

    }

    info['data'] = data;

    return info

}



module.exports = LoadPng