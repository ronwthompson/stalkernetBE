exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments()
    table.string('username').notNullable().defaultsTo('')
    table.string('password').notNullable().defaultsTo('abc123')
    table.string('email').notNullable().defaultsTo('missing@email')
    table.timestamp('account_created_on').notNullable().defaultTo(knex.fn.now())
    table.time('last_login').notNullable().defaultsTo('1970-01-01 00:00:01.662522-05')
  })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
}
