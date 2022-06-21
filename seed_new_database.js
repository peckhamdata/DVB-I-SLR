const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const {seed_database} = require('./seed.js');

const { Sequelize } = require('sequelize');

(async () => {
  const connect_string = process.env.DB_CONNECT_STRING || 'sqlite::memory:'
  const sequelize = new Sequelize(connect_string, {logging: false});
  logger.info('Seeding database');
  await seed_database(sequelize, true)

})();

