const db = require('../db/knex.js')
const Model = require('./Model')('users')

class Faces extends Model {
    static checkPerson(username) {
        return db('people').where({instagram: username}).first()
    }

    static getAll(username) {
        return db('people').where({ instagram: username }).first().then(person => {
            return db('other').where({ username: person.instagram })
            .then(others => {
                person.others = others
                return person
            })
        })
    }

    static createPerson(body) {
        return db('people').insert(body).returning('*')
    }

    static updatePerson(username, body) {
      return db('people').where({instagram: username}).update(body).returning('*')
    }

    static otherLink(body) {
      return db('other').insert(body).returning('*')
    }
}

module.exports = Faces