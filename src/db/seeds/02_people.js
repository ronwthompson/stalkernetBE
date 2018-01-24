exports.seed = function(knex, Promise) {
  return knex('people').del()
    .then(function () {
      return knex('people').insert([
        {first_name: 'Taylor', last_name: 'Swift', instagram: 'taylorswift'},
        {first_name: 'Miranda', last_name: 'Kerr', instagram: 'mirandakerr'}
      ])
    })
}
