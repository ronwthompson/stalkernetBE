exports.up = function(knex, Promise) {
    return knex.schema.createTable('searches', table => {
    table.increments()
    table.string('search_value').notNullable().defaultsTo('none')
    table.string('img_path_array').defaultsTo([])
    table.integer('people_id').defaultsTo(null)
    table.string('quiz_id').defaultsTo(null)
    table.timestamp('searched_on').notNullable().defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('searches')
};
