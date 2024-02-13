const { chr, ord, str_replace, substr, function_exists, gzcompress, gzuncompress, strpos } = require('../PHP_CoreFunctions')
const customReadBuffer = require('./customReadBuffer')
const fs = require('fs')

const LoadPng = (src, readdpi = true) => {

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

    const bpc = imageReader.readint8() //ord(imageReader.readEncodeData(1));
    if (bpc > 8) {
        throw '16-bit depth not supported: ' + file
    }

    const ct = imageReader.readint8() //ord(imageReader.readEncodeData(1));
    const { colorVal, colspace } = pngColorSpace(ct)

    if (imageReader.readint8() !== 0) { throw 'Unknown compression method: ' + file }

    if (imageReader.readint8() !== 0) { throw 'Unknown filter method: ' + file }

    if (imageReader.readint8() !== 0) { throw 'Interlacing not supported: ' + file }

    imageReader.skip(4)
    const dp = `/Predictor 15 /Colors ${colorVal} /BitsPerComponent ${bpc} /Columns ${w}`;

    // Scan chunks looking for palette, transparency and image data
    let pal = '';
    let trns = '';
    let data = '';
    let n
    let dpi

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

        } else if (type === 'IEND') {
            break;
        } else if (type === "pHYs") {
   
            const x = imageReader.readint()//int(r.i32())
            const y = imageReader.readint()//int(r.i32())
            const units = imageReader.readint8()// r.u8()

            if (x == y && readdpi) {
                switch (units) {
                    // if units is 1 then measurement is px/meter
                    case 1:
                        dpi = x / 39.3701 // inches per meter
                    default:
                        dpi = x
                }
            }

            imageReader.skip(4)
        } else {
            imageReader.skip(n + 4)
            //readstream(imagedata, n + 4);
        }

    } while (n);

    if (colspace == 'Indexed' && !pal) {
        throw 'Missing palette in ' + file
    }

    let info = { 'w': w, 'h': h, 'cs': colspace, 'bpc': bpc, 'f': 'FlateDecode', 'dp': dp, 'pal': pal, 'trns': trns, dpi };


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

        info['PDFVersion'] = 1.4
        

        info['WithAlpha'] = true
    } else {
        info['WithAlpha'] = false
    }

    info['data'] = data;

    return info

}


const pngColorSpace = (ct) => {

    let colorVal = 1
    let colspace = ""

    switch (ct) {
        case 0:
        case 4:
            colspace = "DeviceGray"
            break
        case 2:
        case 6:
            colspace = "DeviceRGB"
            colorVal = 3
            break
        case 3:
            colspace = "Indexed"
            break
        default:
            throw `unknown color type in PNG buffer:${ct}`
    }

    return { colorVal, colspace }
}


module.exports = LoadPng