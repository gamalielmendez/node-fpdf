const parseGif = require('./parseGif')
const lzw = require('./lzw')
const deinterlace = require('./deinterlace')
const fs = require('fs')
const { function_exists } = require('../PHP_CoreFunctions')

let PNG;
try {
  require.resolve('pngjs');
  PNG = require('pngjs').PNG;
} catch (err) {
  PNG = null
}

const LoadGif = (src) => {

  if (!function_exists('pngjs')) {
    throw "to load Gif file you need install pngjs: yarn add pngjs"
  }

  const gifFile = parseGif(src)

  const descompresed_frames = decompressFrames(gifFile, false)

  //toma el primer frame para tratar 1de convertirlo a png
  const frame = descompresed_frames[0]

  //guarda el png en el disco y regresa el buffer
  const pngfile = writePng(frame)

  return pngfile
}

const writePng = (frame) => {

  // Crear un nuevo PNG
  const png = new PNG({
    width: frame.dims.width,
    height: frame.dims.height,
    colorType: 6,
    inputColorType: 6,
    inputHasAlpha: true,
  });

  // Convertir los datos del frame a RGBA y llenar el PNG
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const colorIndex = frame.pixels[idx / 4];
      const color = frame.colorTable[colorIndex];

      png.data[idx] = color.red;     // R
      png.data[idx + 1] = color.green; // G
      png.data[idx + 2] = color.blue; // B
      png.data[idx + 3] = colorIndex!==frame.transparentIndex? 255:0 // A

    }
  }

  // Guardar el PNG
  const buffer = PNG.sync.write(png, {
    colorType: 2,
    inputColorType:6,
  });

  //fs.writeFileSync('output.png', buffer);
  return buffer
}


/**
 * codigo extraido de https://github.dev/matt-way/gifuct-js
 * se realizaron ajustes menores
 */
const decompressFrames = (parsedGif, buildImagePatch) => {
  return parsedGif.frames
    .filter(f => f.image)
    .map(f => decompressFrame(f, parsedGif.gctColors, buildImagePatch))
}

const generatePatch = image => {
  const totalPixels = image.pixels.length
  const patchData = new Uint8ClampedArray(totalPixels * 4)

  for (let i = 0; i < totalPixels; i++) {
    const pos = i * 4
    const colorIndex = image.pixels[i]
    const color = image.colorTable[colorIndex] || {red:0, green:0, blue:0}

    patchData[pos] = color.red
    patchData[pos + 1] = color.green
    patchData[pos + 2] = color.blue
    patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0

  }

  //console.log(image.colorTable)
  return patchData
}

const decompressFrame = (frame, gct, buildImagePatch) => {

  if (!frame.image) {
    console.warn('gif frame does not have associated image.')
    return
  }

  const { image } = frame

  // get the number of pixels
  const totalPixels = image.descriptor.width * image.descriptor.height
  // do lzw decompression
  let pixels = lzw(image.data.minCodeSize, image.subBlocksSchema, totalPixels)

  // deal with interlacing if necessary
  if (image.lct.interlaced) {
    pixels = deinterlace(pixels, image.descriptor.width)
  }

  const resultImage = {
    pixels: pixels,
    dims: {
      top: frame.image.descriptor.top,
      left: frame.image.descriptor.left,
      width: frame.image.descriptor.width,
      height: frame.image.descriptor.height
    }
  }

  // color table
  if (image.lct && image.lct.exists) {
    resultImage.colorTable = image.lctColors
  } else {
    resultImage.colorTable = gct
  }

  // add per frame relevant gce information
  if (frame.gce) {
    resultImage.delay = (frame.gce.delay || 10) * 10 // convert to ms
    resultImage.disposalType = frame.gce.extras.disposal
    // transparency
    if (frame.gce.extras.transparentColorGiven) {
      resultImage.transparentIndex = frame.gce.transparentColorIndex
    }
  }

  // create canvas usable imagedata if desired
  if (buildImagePatch) {
    resultImage.patch = generatePatch(resultImage)
  }
  return resultImage
}

module.exports = LoadGif;