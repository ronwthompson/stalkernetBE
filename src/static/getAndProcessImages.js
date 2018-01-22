const fr = require('face-recognition')
const { Chromeless } = require('chromeless')
const fs = require('fs')
const request = require('request')
const Model = require(`../models/faces.model`)
const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()
const drawRects = (win, rects) => rects.forEach(rect => win.addOverlay(rect))

const getImages = async (username) => {
    const chromeless = new Chromeless()

    const photoLinks = await chromeless
        .goto(`https://www.instagram.com/${username}/`)
        .scrollTo(0, 3000)
        .click('._1cr2e')
        .wait(5000)
        .scrollTo(0, 6000)
        .wait(5000)
        .evaluate(() => {
        const links = [].map.call(document.querySelectorAll('._2di5p'), a => a.src)
        return links
    })

    const save = function(uri, filename){
        const e = fs.createWriteStream(filename)
        request(uri).pipe(e)
        return new Promise((resolve, reject) => {
            e.on('finish', resolve)
        })
    }

    const download = async function(uri, filename, callback){
        const data = await save(uri, filename)
        return filename
    }

    if (!fs.existsSync(`./src/faceImages/${username}`)) fs.mkdirSync(`./src/faceImages/${username}`)
    console.log('saving images')

    const imagesPromise = photoLinks.map((el, i) => download(el, `./src/faceImages/${username}/image${i+1}.png`))
    const allPhotos = await Promise.all(imagesPromise)

    console.log('done downloading')
    chromeless.end()
    processImages({ username, photoLinks, allPhotos })
}

const processImages = async (info) =>{
    const username = info.username
    const photoLinks = info.photoLinks
    const allPhotos = info.allPhotos
    console.log('processing images')

    fr.winKillProcessOnExit()

    if (!fs.existsSync(`./src/faceImages/${username}/faces`)) fs.mkdirSync(`./src/faceImages/${username}/faces`)

    for (let p = 0; p < photoLinks.length; p++){
        console.log(`processing image ${p+1}`)
        const image = fr.loadImage(`./src/faceImages/${username}/image${p+1}.png`)

        const startTime = Date.now()
        console.log(`detecting faces from image ${p+1}`)
        const targetSize = 150
        const faceImages = detector.detectFaces(image, targetSize)
        console.log(`done detecting, ${faceImages.length} faces found in ${Math.round(((Date.now()-startTime)/100)/10)} seconds`)
        console.log('setting image')
        for (let i = 0; i < faceImages.length; i++){
            fr.saveImage(`./src/faceImages/${username}/faces/face${p}_${i}.png`, faceImages[i])
        }
        console.log(`image ${p+1} complete`)
    }
    console.log(`face location and saving complete`)
    Model.storeFaces(allPhotos)
    // send email to user with quiz url
}

module.exports = {
    getImages,
    processImages
}