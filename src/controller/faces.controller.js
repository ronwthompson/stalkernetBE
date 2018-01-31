require('dotenv').load()
const Controller = require('./Controller')('users')
const Model = require(`../models/faces.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')

const getAndProcessImages = require('../static/getAndProcessImages')
const trainAndLocate = require('../static/trainNet')

class FaceController extends Controller {
    static async instagram(req, res, next){
        const username = req.params.username
        getAndProcessImages.getImages(username)
        next({ status: 200, message: `Request submitted.  We're working on it!` })
    }

    static async quizFinished(req, res, next){
        trainAndLocate.loadFaceImages(req.body)
        next({ status: 200, message: `Quiz submitted.  We're working on it!` })
    }
}

module.exports = FaceController