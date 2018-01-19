const db = require('../db/knex.js')
const Model = require('./Model')('users')

class Faces extends Model {
    static storeFaces() {
        return [{ message: 'success!' }]
    }
}

module.exports = Faces