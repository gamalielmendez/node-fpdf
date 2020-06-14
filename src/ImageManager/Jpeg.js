
const fs = require('fs');

const MARKERS = [0xffc0,0xffc1,0xffc2,0xffc3,0xffc5,0xffc6,0xffc7,0xffc8,0xffc9,0xffca,0xffcb,0xffcc,0xffcd,0xffce,0xffcf];

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
        data = new Buffer(new Uint8Array(src));
    } else {
        let match;
        if ((match = /^data:.+;base64,(.*)$/.exec(src))) {
            data = new Buffer(match[1], 'base64');
        } else {
            data = fs.readFileSync(src);
            if (!data) {
                return;
            }
        }
    }

    if (data[0] === 0xff && data[1] === 0xd8) {

        if (data.readUInt16BE(0) !== 0xffd8) {
            throw 'SOI not found in JPEG';
        }

        let marker;
        let pos = 2;
        while (pos < data.length) {
            
            marker = data.readUInt16BE(pos);
            
            pos += 2;
            if (MARKERS.includes(marker)) {
                break;
            }
            pos += data.readUInt16BE(pos);
                    
        }
        
        if (!MARKERS.includes(marker)) {
            throw 'Invalid JPEG.';
        }
        
        pos += 2;
        const bits = data[pos++];
        const height = data.readUInt16BE(pos);
        pos += 2;
        const width = data.readUInt16BE(pos);
        pos += 2;

        const channels = data[pos++];
        const colorSpace = COLOR_SPACE_MAP[channels];

        const Img = {
            height, 
            width,
            bits,
            channels,
            colorSpace,
            data: data
        };

        return Img
    } else {
        throw new Error('Unknown image format.');
    }
}

module.exports=LoadJpeg