require('dotenv').load()
const { Chromeless } = require('chromeless')
const Model = require(`../models/faces.model`)

const scrapeGofundme = async (username, gofundmeURL) => {
    console.log('Getting GoFundMe information...')
    const chromeless = new Chromeless()
    const information = await chromeless
        .goto(`${gofundmeURL}`)
        .wait(5000)
        .evaluate(() => {
            const profilePic = document.getElementsByClassName('campaign-img')[0].src
            const accountLink = document.getElementsByClassName('js-profile-co')[0].href
            return { accountLink, profilePic }
        })
    const getInfo = await chromeless
        .goto(`${information.accountLink}`)
        .wait(5000)
        .evaluate(() => {
            const accountName = new URL(window.location).pathname.split('/')[new URL(window.location).pathname.split('/').length-1]
            return accountName
        })
    chromeless.end()
    const updateGofundme = await Model.updatePerson(username, {gofundme: getInfo, gofundme_image: information.profilePic})
}

module.exports = {
    scrapeGofundme
}