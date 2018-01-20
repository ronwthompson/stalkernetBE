const Controller = require('./Controller')('users')
const Model = require(`../models/faces.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')
const fr = require('face-recognition')
const { Chromeless } = require('chromeless')
const fs = require('fs')
const request = require('request')
const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()
const drawRects = (win, rects) => rects.forEach(rect => win.addOverlay(rect))
const ronaldModel = require('../ronaldModel')

class FaceController extends Controller {
    static async getAndProcessImages(req, res, next){
        const username = req.params.username
        const returnInfo = await FaceController.getImages(username)
        console.log('inbetween')
        setTimeout(()=>FaceController.processImages(returnInfo),3000)
        next({ status: 200, message: `Yay` })
    }

    static async fileCheck(info){
        let counter = 0
        while (!fs.existsSync(`./src/faceImages/${info.username}/image1.png`) || counter < 10000){ 
            console.log('not ready yet')
            counter++
        }
    }

    static async getImages(username) {
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

        const download = function(uri, filename, callback){
            request.head(uri, function(err, res, body){
                request(uri).pipe(fs.createWriteStream(filename)).on('finish', callback)
            })
        }

        if (!fs.existsSync(`./src/faceImages/${username}`)) fs.mkdirSync(`./src/faceImages/${username}`)
        console.log('saving images')

        for (let i = 0; i < photoLinks.length; i++){
            download(photoLinks[i], `./src/faceImages/${username}/image${i+1}.png`, () => console.log(`${username}: image${i+1} saved`))
        }

        console.log('done downloading')
        chromeless.end()
        return { username, photoLinks }
    }

    static async processImages(info){
        const username = info.username
        const photoLinks = info.photoLinks

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
            // const faceRectangles = detector.locateFaces(image0)
            console.log(`image ${p+1} complete`)
            // win.addOverlay(faceRectangles)
        }
        console.log(`face location and saving complete, press enter to continue`)
        fr.hitEnterToContinue()


        //INSERT QUIZ HERE TO CHECK FACES

        // const faceMap = fs.readdirSync(`./src/faceImages/${username}/faces/`).map(file => {
        //     fr.loadImage(file).catch(console.err)
        // })

        // console.log(`adding faces`)
        // recognizer.load(ronaldModel)
        // recognizer.addFaces(faceMap, `${username}`)

        // const testing = fr.loadImage('./testing.jpg') //img to test facial recog with

        // console.log(`faces added, predicting...`)
        // let startTime = Date.now()
        // const predictions = recognizer.predict(testing)
        // console.log(`predicting completed in ${Math.round(((Date.now()-startTime)/100)/10)} seconds`)
        // console.log(predictions)

        //await next({ status: 200, message: `Yay` })
    }
}

module.exports = FaceController
