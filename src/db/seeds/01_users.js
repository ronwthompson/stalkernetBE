exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {username: 'ronald', email: 'abc@123.com', password: '$2a$10$TgUeSdj0c5pDtmt4jgJA5.R1UVFeJQ3RJLqmgjD8oysj2NFzJVTo6', account_created_on: '2001-12-23 14:39:53.662522-05', last_login: '2001-12-23 14:39:53.662522-05'}, //pass is abc123
        {username: 'wes', email: 'teacher@galvanize.com', password: '$2a$10$f6avmjZc.ANrmDAw28lGOOgv3UlATGQBzyNlTAnCJB3Kv/6p40jb2', account_created_on: '2001-12-23 14:39:53.662522-05', last_login: '2001-12-23 14:39:53.662522-05'}, //pass is 12345
        {username: 'justin', email: 'fake@email.com', password: '$2a$10$zqWK5p/1UHqvXdfv8s9HFOcPpakcodQ1WWv6Y12IKGqSOodqERwtS', account_created_on: '2001-12-23 14:39:53.662522-05', last_login: '2001-12-23 14:39:53.662522-05'} //pass is smokesomedays
      ])
    })
}
