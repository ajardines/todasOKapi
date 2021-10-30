const knex = require('knex');
const databaseConfig = require('../../../knexfile');

const db = knex(databaseConfig);

module.exports = db;
