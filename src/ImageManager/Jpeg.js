
const fs = require('fs');
const customReadBuffer = require('./customReadBuffer')

const MARKERS = [0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9, 0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf];

const COLOR_SPACE_MAP = {
    1: 'DeviceGray',
    3: 'DeviceRGB',
    4: 'DeviceCMYK'
};

const LoadJpeg = (src) => {

    let data

    if (Buffer.isBuffer(src)) {
        data = src;
    } else if (src instanceof ArrayBuffer) {
        data = Buffer.from(new Uint8Array(src));
    } else {
        let match;
        if ((match = /^data:.+;base64,(.*)$/.exec(src))) {
            data = Buffer.from(match[1], 'base64');
        } else {
            data = fs.readFileSync(src);
            if (!data) {
                return;
            }
        }
    }

    const imageReader = new customReadBuffer(data)

    const Signature = imageReader.readChunk(2)
    if (Signature[0] !== 0xff || Signature[1] !== 0xd8) {
        throw new Error('Unknown image format.');
    }

    if (Signature.readUInt16BE(0) !== 0xffd8) {
        throw 'SOI not found in JPEG';
    }

    let marker;
    let pos = 2;
    while (pos < data.length) {

        marker = imageReader.readUInt16dBEByPos(pos);

        pos += 2;
        if (MARKERS.includes(marker)) {
            break;
        }

        pos += imageReader.readUInt16dBEByPos(pos);
   
    }

    if (!MARKERS.includes(marker)) {
        throw 'Invalid JPEG.';
    }

    pos += 2;
    const bits = data[pos++];
    const height = imageReader.readUInt16dBEByPos(pos);
    pos += 2;
    const width = imageReader.readUInt16dBEByPos(pos);
    pos += 2;

    const channels = data[pos++];
    const colorSpace = COLOR_SPACE_MAP[channels];

    const Img = {
        height,
        width,
        bits,
        channels,
        colorSpace,
        data
    };

    return Img

}

module.exports = LoadJpeg