const express = require('express')
const YAML = require('yamljs')
const { connector } = require('swagger-routes-express')
const api = require('./api')
const cors = require('cors')
const pino = require('pino');
const expressPino = require('express-pino-logger');
var session = require('express-session');

var memoryStore = new session.MemoryStore();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

const makeApp = () => {
  const apiDefinition = YAML.load('./api/swagger.yaml')


  let options = {}

  const connect = connector(api,
                            apiDefinition,
                            options); // make the connector
  const app = express() // make the app
  app.use(expressLogger);
  app.use(cors())

  app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));

  connect(app) // attach the routes
  // add any error handlers last

  return app
}

const app = makeApp();
module.exports = app;
