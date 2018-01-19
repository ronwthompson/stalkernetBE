const db = require('../db/knex.js')
const Model = require('./Model')('users')

class User extends Model {

    static oneFromEmail(email) {
        return db('users').where({ email }).first()
    }

    static oneFromUsername(username) {
        return db('users').where({ username }).first()
    }

    static index() {
        return db('users').select('id', 'username', 'email', 'isAdmin', 'account_created_on', 'last_login')
    }

    static oneSafe(id) {
        return db('users').select('id', 'username', 'isAdmin', 'account_created_on', 'last_login').where({ id }).first()
    }

    static oneAdmin(id) {
        return db('users').select('id', 'username', 'email', 'isAdmin', 'account_created_on', 'last_login').where({ id }).first()
    }
}

module.exports = User