require('dotenv').load()
const path = require('path')
const fr = require('face-recognition')
const { Chromeless } = require('chromeless')
const fs = require('fs')
const rp = require('request-promise')
const request = require('request')
const Model = require(`../models/faces.model`)
const detector = fr.FaceDetector()
const recognizer = fr.FaceRecognizer()
const drawRects = (win, rects) => rects.forEach(rect => win.addOverlay(rect))
const sendemail = require('sendemail')
const email = sendemail.email
sendemail.set_template_directory(path.join(__dirname, '..', '..', 'templates'))
const ronaldModel = require('./ronaldModel.json')

const loadFaceImages = async (body) => {
    const username = body.username
    const fileLocations = body.files
    const accepted = body.accepted
    const onlyAcceptedFaces = []

    fileLocations.length !== accepted.length ? console.log('Error!') : console.log('Loading images...')

    accepted.forEach((e,i) => {
        if (e) {
            const file = fileLocations[i].split('/')
            onlyAcceptedFaces.push(fr.loadImage(path.join(__dirname, '..',file[file.length-4],file[file.length-3],file[file.length-2],file[file.length-1])))
        }
    })

    console.log('Training neural network...')
    recognizer.load(ronaldModel)
    recognizer.addFaces(onlyAcceptedFaces, username)

    const modelState = recognizer.serialize()
    fs.writeFileSync(`${username}Model.json`, JSON.stringify(modelState))

                        //&imgType=face
    const searchURL = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&searchType=image&cx=${process.env.GOOGLE_API_ID}&q=${username}`
    let results = {}
    const oneThrough10 = rp(`${searchURL}&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         } 
    })
    // const elevenThrough20 = rp(`${searchURL}&start=1`, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         return JSON.parse(body)
    //      }
    // })
    // const twentyoneThrough30 = rp(`${searchURL}&start=1`, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         return JSON.parse(body)
    //      }
    // })
    await Promise.all([oneThrough10]).then(searchResults => {
        results = JSON.parse(searchResults[0]) //for some reason, cannot concat items arrays together
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

    if (!fs.existsSync(path.join(__dirname,`..`,`googleImages`,`${username}`))) fs.mkdirSync(path.join(__dirname,`..`,`googleImages`,`${username}`))
    console.log('Downloading and saving images...')

    const imagesPromise = results.items.map((el, i) => download(el.link, path.join(__dirname,`..`,`googleImages`,`${username}`,`image${i+1}.png`)))
    const allPhotoLocations = await Promise.all(imagesPromise)
    console.log('Finished downloading images from the Google API.')

    console.log(`Locating faces and analyzing...`)
    let allResults = []
    const unknownThreshold = 0.6
    let allPhotos = []
    allPhotoLocations.forEach((e,i) => {
        const file = e.split('/')
        try {
            const addFileImage = fr.loadImage(path.join(__dirname, '..',file[file.length-3],file[file.length-2],file[file.length-1]))
            allPhotos.push(addFileImage)
        } catch(err){
            allPhotos.push(false)
        }       

    })
    console.log(`Starting processing on found images...`)
    for (let i = 0; i < allPhotos.length; i++){
        if (allPhotos[i]){
            const startTime = Date.now()
            const faceRects = detector.locateFaces(allPhotos[i]).map(res => res.rect)
            const faces = detector.getFacesFromLocations(allPhotos[i], faceRects, 150)
            console.log(`${faces.length} faces found in image ${i+1}`)
            faceRects.forEach((rect, ind) => {
                const prediction = recognizer.predictBest(faces[ind], unknownThreshold)
                if (prediction.distance <= 0.6 && !allResults[i]) allResults.push(prediction)
            })
            if (allResults.length === i) allResults.push({className: 'unknown', distance: 1})
            console.log(`Result #${i+1} finished in ${Math.round(((Date.now()-startTime)/100)/10)} seconds.`)
        } else {
            console.log(`Result #${i+1} is not a valid file.`)
            allResults.push({className: 'unknown', distance: 1})
        }
    }
    console.log(allResults)
    console.log(results.items)
}

module.exports = {
    loadFaceImages
}