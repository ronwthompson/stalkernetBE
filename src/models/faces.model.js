const db = require('../db/knex.js')
const Model = require('./Model')('users')

class Faces extends Model {
    static storeFaces(faces) {
        console.log(faces)
    }
}

module.exports = Faces