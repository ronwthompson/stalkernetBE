const path = require('path')
const fr = require('face-recognition')
const { Chromeless } = require('chromeless')
const fs = require('fs')
const request = require('request')
const Model = require(`../models/faces.model`)
require('dotenv').load()
const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()
const drawRects = (win, rects) => rects.forEach(rect => win.addOverlay(rect))
const sendemail = require('sendemail')
const email = sendemail.email
sendemail.set_template_directory(path.join(__dirname, '..', '..', 'templates'))

const getImages = async (username) => {
    console.log('Getting instagram pictures...')
    const chromeless = new Chromeless()
    const photoLinks = await chromeless
        .goto(`https://www.instagram.com/${username}/`)
        .scrollTo(0, 3000)
        .click('._1cr2e')
        .wait(5000)
        .scrollTo(0, 6000)
        .wait(5000)
        .scrollTo(0, 9000)
        .wait(5000)
        .scrollTo(0, 12000)
        .wait(5000)
        .evaluate(() => {
        const links = [].map.call(document.querySelectorAll('._2di5p'), a => a.src)
        return links
    })

    console.log(`Page Loaded, ${photoLinks.length} images found.`)

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

    if (!fs.existsSync(path.join(__dirname,`..`,`faceImages`,`${username}`))) fs.mkdirSync(path.join(__dirname,`..`,`faceImages`,`${username}`))
    console.log('Saving images...')

    const imagesPromise = photoLinks.map((el, i) => download(el, path.join(__dirname,`..`,`faceImages`,`${username}`,`image${i+1}.png`)))
    const allPhotos = await Promise.all(imagesPromise)
    chromeless.end()
    processImages({ username, photoLinks, allPhotos })
}

const processImages = async (info) =>{
    const username = info.username
    const photoLinks = info.photoLinks
    const allPhotos = info.allPhotos
    const faceLocationArray = []
    console.log('Processing images...')

    fr.winKillProcessOnExit()

    if (!fs.existsSync(path.join(__dirname,`..`,`faceImages`,`${username}`,`faces`))) fs.mkdirSync(path.join(__dirname,`..`,`faceImages`,`${username}`,`faces`))

    for (let p = 0; p < photoLinks.length; p++){
        const image = fr.loadImage(path.join(__dirname,`..`,`faceImages`,`${username}`,`image${p+1}.png`))

        const startTime = Date.now()
        console.log(`Detecting faces from image ${p+1}...`)
        const targetSize = 150
        const faceImages = detector.detectFaces(image, targetSize)
        console.log(`Done detecting, ${faceImages.length} faces found in ${Math.round(((Date.now()-startTime)/100)/10)} seconds.`)
        for (let i = 0; i < faceImages.length; i++){
            fr.saveImage(path.join(__dirname,`..`,`faceImages`,`${username}`,`faces`,`face${p}_${i}.png`), faceImages[i])
            faceLocationArray.push(path.join(__dirname,`..`,`faceImages`,`${username}`,`faces`,`face${p}_${i}.png`))
        }
    }
    console.log(`Face location and saving complete.`)
    //Model.storeFaces(allPhotos)
    // send email to user with quiz url

    const quizID = btoa(JSON.stringify(faceLocationArray))

    const person = {
      name : "Stalker",
      email: "stalkernetdev@gmail.com",
      subject:"Testing StalkerNET",
      quizUrl: `http://52.38.201.169/?quiz=${username}&faces=${quizID}`
    }
     
    email('quiz', person, function(error, result){
      console.log(`Email sent to ${username}`)
    })
}

module.exports = {
    getImages,
    processImages
}