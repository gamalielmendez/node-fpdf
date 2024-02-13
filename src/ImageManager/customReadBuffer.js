class customReadBuffer {

    constructor(buffer) {
        this.buffer = buffer
        this.bytesRead = 0
    }

    readChunk(bytesToRead) {

        let chunkSize = bytesToRead; // Define el tamaño de los trozos que quieres leer
        let readBuffer = Buffer.alloc(chunkSize);

        //si el chunkSize ya no cabe lo ajusta al tamaño del archivo
        if (this.bytesRead + chunkSize > this.buffer.length) {
            chunkSize = this.buffer.length - this.bytesRead;
            readBuffer = Buffer.alloc(chunkSize);
        }

        //copia el buffer de entrada al buffer de salida, desde el punto de lectura actual hasta el punto de lectura actual + chunkSize. El punto de lectura actual se incrementa en chunkSize para que el punto de lectura siguiente sea el punto de lectura
        this.buffer.copy(readBuffer, 0, this.bytesRead, this.bytesRead + chunkSize);

        this.bytesRead += chunkSize;
        return readBuffer;
    }

    readint() {
        // Read a 4-byte integer from stream
        const readData = this.readChunk(4);
        return readData.readInt32BE()
    }

    readint8() {
        // Read a 4-byte integer from stream
        const readData = this.readChunk(1);
        return readData.readUint8()
    }

    readEncodeData(bytesToRead, encode = 'binary') {

        const readData = this.readChunk(bytesToRead);
        return readData.toString(encode);

    }

    readString(bytesToRead) {
        const readData = this.readChunk(bytesToRead);
        return Array.from(readData).map(value => String.fromCharCode(value)).join('')
    }

    readUInt16dLE() {
        const readData = this.readChunk(2);
        return readData.readUInt16LE()
    }

    readUInt16dBE() {
        const readData = this.readChunk(2);
        return readData.readUInt16BE()
    }
    
    readUInt16dBEByPos(pos) {
        return this.buffer.readUInt16BE(pos)
    }


    curretByte() {
        return this.buffer[this.bytesRead]
    }

    readBits(schema) {

        const byte = this.readChunk(1)[0]

        // convert the byte to bit array
        const bits = new Array(8)
        for (var i = 0; i < 8; i++) {
            bits[7 - i] = !!(byte & (1 << i))
        }

        return Object.keys(schema).reduce((res, key) => {
            const def = schema[key]
            if (def.length) {
                res[key] = subBitsTotal(bits, def.index, def.length)
            } else {
                res[key] = bits[def.index]
            }
            return res
        }, {})

    }

    skip(bytesToSkip) {
        this.bytesRead += bytesToSkip
    }
}

const subBitsTotal = (bits, startIndex, length) => {
    var result = 0
    for (var i = 0; i < length; i++) {
        result += bits[startIndex + i] && 2 ** (length - i - 1)
    }
    return result
}

module.exports = customReadBuffer