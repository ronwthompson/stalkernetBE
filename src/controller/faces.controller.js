const Controller = require('./Controller')('users')
const Model = require(`../models/faces.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')

const getAndProcessImages = require('../static/getAndProcessImages')

class FaceController extends Controller {
    static async instagram(req, res, next){
        const username = req.params.username
        getAndProcessImages.getImages(username) //this function calls the model
        next({ status: 200, message: `Request submitted.  We're working on it!` })
    }
}

module.exports = FaceController
