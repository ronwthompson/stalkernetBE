exports.seed = function(knex, Promise) {
  return knex('searches').del()
    .then(function () {
      return knex('searches').insert([
        {search_value: 'taylorswift', people_id: 1},
        {search_value: 'mirandakerr', people_id: 2}
      ])
    })
}
