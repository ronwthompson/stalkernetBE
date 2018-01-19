const db = require('../db/knex')

module.exports = (tableName) => {
  class Model {
    constructor () {}

    static index() {
      return db(tableName)
    }

    static show(id) {
      return db(tableName).where({id}).first()
    }

    static create(body) {
      return db(tableName).insert(body).returning('*').then(([result]) => result)
    }

    static update(id, body) {
      return db(tableName).where({ id }).update(body).returning('*').then(([result]) => result)
    }

    static delete(id) {
      return db(tableName).where({ id }).returning('*').del().then(([result]) => result)
    }
  }

  return Model
}