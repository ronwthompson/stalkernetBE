const db = require('../db/knex.js')
const Model = require('./Model')('users')

class Faces extends Model {
    static checkPerson(username) {
        return db('people').where({instagram: username}).first()
    }

    static createPerson(body) {
        return db('people').insert(body).returning('*')
    }

    static updatePerson(username, body) {
      return db('people').where({instagram: username}).update(body).returning('*')
    }
}

module.exports = Faces