require('dotenv').load()
const Controller = require('./Controller')('users')
const Model = require(`../models/faces.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')

const getAndProcessImages = require('../static/getAndProcessImages')
const trainAndLocate = require('../static/trainNet')

class FaceController extends Controller {
    static async getInfo(req, res, next){
        const username = req.params.username
        const result = await Model.checkPerson(username)
        res.send(result)
    }

    static async getAllInfo(req, res, next){
        const username = req.params.username
        const result = await Model.getAll(username)
        res.send(result)
    }

    static async addOther(req, res, next){
        const username = req.body.username
        const otherLink = req.body.otherLink
        const body = { username, other_link: otherLink }
        const result = await Model.otherLink(body)
        res.send(result)
    }

    static async instagram(req, res, next){
        const username = req.params.username
        const email = req.body.email
        getAndProcessImages.getImages(username, email)
        next({ status: 200, message: `Request submitted.  We're working on it!` })
    }

    static async quizFinished(req, res, next){
        trainAndLocate.loadFaceImages(req.body)
        next({ status: 200, message: `Quiz submitted.  We're working on it!` })
    }
}

module.exports = FaceController