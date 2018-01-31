require('dotenv').load()
const { Chromeless } = require('chromeless')
const Model = require(`../models/faces.model`)

const scrapeTwitter = async (username, twitterID) => {
    console.log('Getting Twitter information...')
    const chromeless = new Chromeless()
    const information = await chromeless
        .goto(`https://www.twitter.com/${twitterID}`)
        .wait(5000)
        .evaluate(() => {
            const location = document.querySelectorAll('.ProfileHeaderCard-locationText')[0].innerText
            return location
        })
    console.log(`Page Loaded, location found.`, information)
    chromeless.end()
    const updateTwitter = await Model.updatePerson(username, {twitter: twitterID, location: information})
    console.log('twitter update: ',updateTwitter)
}

module.exports = {
    scrapeTwitter
}