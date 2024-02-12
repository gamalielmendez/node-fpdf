const customReadBuffer = require('./customReadBuffer');

const fs = require('fs');

const parseGif = (src) => {

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

    //load the gif image
    const imageReader = new customReadBuffer(imagedata)

    //extract signatire and version
    const signature = imageReader.readString(3)
    const version = imageReader.readString(3)

    //extract width and height
    const width = imageReader.readUInt16dLE()
    const height = imageReader.readUInt16dLE()

    // extract GCT
    //const byteGCT = imageReader.readChunk(1)[0]
    const gct = imageReader.readBits({
        exists: { index: 0 },
        resolution: { index: 1, length: 3 },
        sort: { index: 4 },
        size: { index: 5, length: 3 },
    })

    const backgroundColorIndex = imageReader.readChunk(1)[0]
    const pixelAspectRatio = imageReader.readChunk(1)[0]

    //read GCT
    const gctColors = readGCT(imageReader, gct)

    //read frames from Gif
    const framesResult = readFrames(imageReader)

    return {
        signature,
        version,
        width,
        height,
        gct,
        backgroundColorIndex,
        pixelAspectRatio,
        gctColors,
        frames: framesResult.frames,
        application: framesResult.application
    }

}

/*
* codigo extraido de https://github.dev/matt-way/gifuct-js
*/

const readGCT = (imageReader, gct) => {

    if (!gct.exists) {
        return []
    }

    // Calcula el tamaño de la GCT
    const gctSize = Math.pow(2, gct.size + 1);
    const gctData = imageReader.readChunk(gctSize * 3);
    const gctColors = []

    for (let i = 0; i < gctSize; i++) {
        const red = gctData[i * 3];
        const green = gctData[i * 3 + 1];
        const blue = gctData[i * 3 + 2];
        gctColors.push({ red, green, blue });
    }

    return gctColors
}

const readApplication = (imageReader) => {

    const blockSize = imageReader.readChunk(1)[0]
    const applicationIdentifier = imageReader.readString(8)
    const applicationAutenticationCode = imageReader.readString(3)

    return {
        blockSize,
        applicationIdentifier,
        applicationAutenticationCode,
        subBlocksSchema: subBlocksSchema(imageReader)
    }
}

const readGCE = (imageReader) => {

    const byteSize = imageReader.readChunk(1)[0]
    const extras = imageReader.readBits({
        future: { index: 0, length: 3 },
        disposal: { index: 3, length: 3 },
        userInput: { index: 6 },
        transparentColorGiven: { index: 7 },
    })

    const delay = imageReader.readUInt16dLE()
    const transparentColorIndex = imageReader.readChunk(1)[0]
    const terminator = imageReader.readChunk(1)[0]

    return {
        byteSize,
        extras,
        delay,
        transparentColorIndex,
        terminator
    }
}

const readPlainText = (imageReader) => {

    const byteSize = imageReader.readChunk(1)[0]

    const gridLeft = imageReader.readUInt16dLE()
    const gridTop = imageReader.readUInt16dLE()
    const gridWidth = imageReader.readUInt16dLE()
    const gridHeight = imageReader.readUInt16dLE()

    const cellWidth = imageReader.readChunk(1)[0]
    const cellHeight = imageReader.readChunk(1)[0]
    const foregroundColorIndex = imageReader.readChunk(1)[0]
    const backgroundColorIndex = imageReader.readChunk(1)[0]

    return {
        byteSize,
        gridLeft,
        gridTop,
        gridWidth,
        gridHeight,
        cellWidth,
        cellHeight,
        foregroundColorIndex,
        backgroundColorIndex,
        subBlocksSchema: subBlocksSchema(imageReader)
    }
}

const readComment = (imageReader) => {

    return {
        subBlocksSchema: subBlocksSchema(imageReader)
    }
}

const readLCT = (imageReader, lct) => {

    if (!lct.exists) {
        return []
    }

    // Calcula el tamaño de la GCT
    const lctSize = Math.pow(2, lct.size + 1);
    const lctData = imageReader.readChunk(lctSize * 3);
    const lctColors = []

    for (let i = 0; i < lctSize; i++) {
        const red = lctData[i * 3];
        const green = lctData[i * 3 + 1];
        const blue = lctData[i * 3 + 2];
        lctColors.push({ red, green, blue });
    }
    //console.log('lctColors', lctColors.length)
    return lctColors
}

const readImage = (imageReader) => {
    //retrocede un espacio
    imageReader.bytesRead -= 1
    //lee el descriptor de la imagen
    const left = imageReader.readUInt16dLE()
    const top = imageReader.readUInt16dLE()
    const width = imageReader.readUInt16dLE()
    const height = imageReader.readUInt16dLE()

    const lct = imageReader.readBits({
        exists: { index: 0 },
        interlaced: { index: 1 },
        sort: { index: 2 },
        future: { index: 3, length: 2 },
        size: { index: 5, length: 3 },
    })

    lctColors = readLCT(imageReader, lct)

    const data = {
        minCodeSize: imageReader.readChunk(1)[0]
    }

    return {
        descriptor: {
            left,
            top,
            width,
            height
        },
        lct,
        lctColors,
        data,
        subBlocksSchema: subBlocksSchema(imageReader)
    }
}

const readFrames = (imageReader) => {

    let code = imageReader.readChunk(2)

    const frames = []
    let frame = {
        gce: null,
        image: null
    }

    const application = []

    do {

        if (frame.image !== null) {
            frames.push(frame)
            frame = {
                gce: null,
                image: null
            }
        }

        //console.log(code.toString('hex'))
        // Este es un bloque de extensión
        if (code[0] === 0x21) {

            switch (code[1]) {
                case 0xFF:
                    application.push(readApplication(imageReader))
                    break;
                case 0xF9:
                    frame.gce = readGCE(imageReader)
                    break;
                case 0x01:
                    frame.text = readPlainText(imageReader)
                    break;
                case 0xFE:
                    frame.comment = readComment(imageReader)
                    break;
            }

        } else if (code[0] === 0x2c) {
            frame.image = readImage(imageReader)
        }

        //se lee el nuevo cose
        code = imageReader.readChunk(2)

    } while (code[0] === 0x21 || code[0] === 0x2c)

    if (frame.image !== null) {
        frames.push(frame)
    }

    return {
        application,
        frames
    }

}

const subBlocksSchema = (imageReader) => {

    const chunks = []
    const streamSize = imageReader.buffer.length
    let total = 0
    let size

    do {
        size = imageReader.readChunk(1)[0]

        if (size === 0x00) { break }

        if (imageReader.readBytes + size >= streamSize) {
            const availableSize = streamSize - imageReader.readBytes
            chunks.push(imageReader.readChunk(availableSize))
            total += availableSize
            break
        }

        chunks.push(imageReader.readChunk(size))
        total += size

    } while (size !== 0x00)

    const result = new Uint8Array(total)
    let offset = 0

    for (let i = 0; i < chunks.length; i++) {
        result.set(chunks[i], offset)
        offset += chunks[i].length
    }

    return result
}

module.exports = parseGif;
