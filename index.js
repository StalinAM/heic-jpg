import fs from 'node:fs'
import path from 'node:path'
import heicConvert from 'heic-convert'
import sharp from 'sharp'

const convertHeicToJpg = async (heicPath, jpgPath) => {
  try {
    const heicBuffer = await fs.promises.readFile(heicPath)
    const jpgBuffer = await heicConvert({
      buffer: heicBuffer,
      format: 'JPEG'
    })
    await sharp(jpgBuffer).jpeg({ quality: 90 }).toFile(jpgPath)

    console.log(`Conversion complete: ${jpgPath}`)
  } catch (error) {
    console.error('Error during conversion:', error)
  }
}

const processDirectory = (inputDir, outputDir) => {
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input directory:', err)
      return
    }

    files.forEach((file) => {
      const ext = path.extname(file).toLowerCase()
      if (ext === '.heic') {
        const inputFilePath = path.join(inputDir, file)
        const outputFilePath = path.join(
          outputDir,
          `${path.basename(file, ext)}.jpg`
        )
        convertHeicToJpg(inputFilePath, outputFilePath)
      }
    })
  })
}
const inputDir = path.join('images')
const outputDir = path.join('output_images')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

processDirectory(inputDir, outputDir)
