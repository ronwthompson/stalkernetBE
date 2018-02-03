exports.up = function(knex, Promise) {
    return knex.schema.createTable('other', table => {
    table.increments()
    table.string('username').notNullable().defaultsTo('none')
    table.string('other_link').notNullable().defaultsTo('none')
    table.string('other_image').notNullable().defaultsTo('none')
  })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('other')
}
