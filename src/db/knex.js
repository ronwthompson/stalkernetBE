'use strict';
require('dotenv').load()

const environment = process.env.NODE_ENV || 'production';
const knexConfig = require('../../knexfile')[environment];
const knex = require('knex')(knexConfig);

module.exports = knex;
