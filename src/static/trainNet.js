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
const twitterScrape = require('./twitterScrape')
const gofundmeScrape = require('./gofundmeScrape')

const loadFaceImages = async (body) => {
    const username = body.username
    const emailAddress = body.email
    const exists = await Model.checkPerson(username)
    const firstName = exists.first_name
    const lastName = exists.last_name
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

    const searchURL = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&searchType=image&cx=${process.env.GOOGLE_API_ID}`
    const searchURLsocial = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&searchType=image&cx=${process.env.GOOGLE_API_ID_SOCIAL}`
    let results = {}
    const oneThrough10 = rp(`${searchURL}&q=${username}&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         } 
    })
    const elevenThrough20 = rp(`${searchURL}&q=${username}&start=11`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const oneThrough10social = rp(`${searchURLsocial}&q=${username}&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         } 
    })
    const elevenThrough20social = rp(`${searchURLsocial}&q=${username}&start=11`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const twitter1to10 = rp(`${searchURLsocial}&q=${firstName}%20${lastName}%20twitter&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const twitter11to20 = rp(`${searchURLsocial}&q=${firstName}%20${lastName}%20twitter&start=11`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const linkedin1to10 = rp(`${searchURL}&q=%22${firstName}%20${lastName}%22%20linkedin&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const linkedin11to20 = rp(`${searchURL}&q=%22${firstName}%20${lastName}%22%20linked&start=11`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const gofundme1to10 = rp(`${searchURL}&q=%22${firstName}%20${lastName}%22%20gofundme&start=1`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    const gofundme11to20 = rp(`${searchURL}&q=%22${firstName}%20${lastName}%22%20gofundme&start=11`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body)
         }
    })
    await Promise.all([oneThrough10, elevenThrough20, 
                        oneThrough10social, elevenThrough20social, 
                        twitter1to10, twitter11to20,
                        linkedin1to10, linkedin11to20,
                        gofundme1to10, gofundme11to20
                        ]).then(searchResults => {
        results = JSON.parse(searchResults[0]).items.concat(JSON.parse(searchResults[1]).items, 
                                                            JSON.parse(searchResults[2]).items, 
                                                            JSON.parse(searchResults[3]).items, 
                                                            JSON.parse(searchResults[4]).items, 
                                                            JSON.parse(searchResults[5]).items,
                                                            JSON.parse(searchResults[6]).items, 
                                                            JSON.parse(searchResults[7]).items,
                                                            JSON.parse(searchResults[8]).items, 
                                                            JSON.parse(searchResults[9]).items)
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

    const imagesPromise = results.map((el, i) => download(el.link, path.join(__dirname,`..`,`googleImages`,`${username}`,`image${i+1}.png`)))
    const allPhotoLocations = await Promise.all(imagesPromise)
    console.log('Finished downloading images from the Google API.')

    console.log(`Locating faces and analyzing...`)
    let allResults = []
    const unknownThreshold = 0.6
    let allPhotos = []
    allPhotoLocations.forEach((e,i) => {
        const file = e.split('/')
        try {
            const stats = fs.statSync(path.join(__dirname, '..',file[file.length-3],file[file.length-2],file[file.length-1]))
            const fileSizeInBytes = stats["size"]
            if (fileSizeInBytes < 750000) {
                const addFileImage = fr.loadImage(path.join(__dirname, '..',file[file.length-3],file[file.length-2],file[file.length-1]))
                allPhotos.push(addFileImage)
            } else {
                allPhotos.push(false)
            }
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

    let positiveResults = []

    for (let i = 0; i < allResults.length; i++){
        if (allResults[i].className !== 'unknown') {
            let individualResult = {}
            individualResult.domain = results[i].displayLink
            individualResult.accountLink = results[i].image.contextLink
            individualResult.imageLink = results[i].link
            if (positiveResults.filter(result => (result.domain === individualResult.domain)).length === 0) positiveResults.push(individualResult)
        }
    }
    console.log('User found at the following other websites:')
    console.log(positiveResults)

    for (let i = 0; i < positiveResults.length; i++){
        if (positiveResults[i].domain.includes('twitter.com')){
            const twitterURL = positiveResults[i].accountLink
            const twitterID = twitterURL.split('/')[3]
            twitterScrape.scrapeTwitter(username, twitterID)
        } if (positiveResults[i].domain.includes('gofundme.com')){
            const gofundmeURL = positiveResults[i].accountLink
            gofundmeScrape.scrapeGofundme(username, gofundmeURL)
        } else if (positiveResults[i].domain.includes('linkedin.com')){
            const linkedinURL = positiveResults[i].accountLink
            const linkedinID = linkedinURL.split('/')[4]
            const updateLinkedin = await Model.updatePerson(username, {linkedin: linkedinID, linkedin_image: positiveResults[i].imageLink})
        } else {
            const addOther = await Model.otherLink({username, other_link: positiveResults[i].accountLink, other_image: positiveResults[i].imageLink})
        }
    }

    console.log('Added information to database, analysis complete!')

    const person = {
      name : "Stalker",
      email: emailAddress,
      subject:"stalkerNET: Your results are now ready.",
      resultsURL: `http://34.217.105.224/?results=${username}`
    }
     
    email('results', person, function(error, result){
      console.log(`Email sent with results link!`)
    })
}

module.exports = {
    loadFaceImages
}