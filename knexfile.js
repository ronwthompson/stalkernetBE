require('dotenv').load()
const path = require('path')

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/stalkernet_dev',
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds')
    }
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/stalkernet_test',
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds')
    }
  },

  production: {
    client: 'pg',
    connection: `postgres://iloverice:kelispell@stalkernet.c4dgh9rsuw0j.us-west-2.rds.amazonaws.com/stalkernet`,
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds')
    }
  }
};