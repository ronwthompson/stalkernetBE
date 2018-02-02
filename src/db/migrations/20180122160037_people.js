exports.up = function(knex, Promise) {
    return knex.schema.createTable('people', table => {
    table.increments()
    table.string('first_name').notNullable().defaultsTo('none')
    table.string('last_name').notNullable().defaultsTo('none')
    table.string('location').defaultsTo(null)
    table.string('birthday').defaultsTo(null)
    table.string('face_model').defaultsTo(null)
    table.string('facebook').defaultsTo(null)
    table.string('flickr').defaultsTo(null)
    table.string('foursquare').defaultsTo(null)
    table.string('goodreads').defaultsTo(null)
    table.string('googleplus').defaultsTo(null)
    table.string('instagram').defaultsTo(null)
    table.string('linkedin').defaultsTo(null)
    table.string('livejournal').defaultsTo(null)
    table.string('meetup').defaultsTo(null)
    table.string('myspace').defaultsTo(null)
    table.string('pinterest').defaultsTo(null)
    table.string('tumblr').defaultsTo(null)
    table.string('twitter').defaultsTo(null)
    table.string('yelp').defaultsTo(null)
    table.string('other').defaultsTo(null)
  })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('people')
}
