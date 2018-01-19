const Controller = require('./Controller')('users')
const Model = require(`../models/users.model`)
const encryption = require('../encryption')
const jwt = require('jsonwebtoken')

class UsersController extends Controller {
    static create(req, res, next) {
        encryption.promiseHash(req.body.password).then(hashedPass => {
            req.body.password = hashedPass
            console.log(req.body.password);
            super.create(req, res, next)
        })
    }

    static addDefaults(req, res, next) {
        req.body.isAdmin = req.body.isAdmin === undefined ? false : req.body.isAdmin

        next()
    }

    static show(req, res, next) {
        if (res.userType === 'admin') {
            Model.oneAdmin(req.params.id).then(response => {
                res.json({
                    userType: res.userType,
                    users: response
                })
            })
        } else if (res.userType === 'user' || res.userType === 'guest') {
            Model.oneSafe(req.params.id).then(response => {
                res.json({
                    userType: res.userType,
                    users: response
                })
            })
        } else {
            next({ status: 401, message: 'Unidentified userType' })
        }
    }
}

module.exports = UsersController
