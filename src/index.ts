import { handleUncaughtException } from './utils/handleUncaughtException'
import { timelineRouter, simulatorRouter, authenticationRouter, followRouter, messageRouter, healthcheckRouter } from './routes'
import { killPool } from './database'
import { formatDatetime, getGravatarUrl, logger } from './utils'
import { initDB } from './models'
import promBundle = require('express-prom-bundle');

const normalizePath: Array<[string, string]> = [
  ['^/fllws/.*', '/fllws/#name'],
  ['^/msgs/.*', '/msgs/#name']
]
const metricsMiddleware = promBundle({ includeMethod: true, includePath: true, includeStatusCode: true, normalizePath })

import express = require('express')
import gracefulShutdown = require('http-graceful-shutdown')
import session = require('express-session')
import nunjucks = require('nunjucks')
import flash = require('express-flash')
import cookieParser = require('cookie-parser')
import bodyParser = require('body-parser')

const PORT = Number(process.env.PORT || 3000)
const API_PORT = Number(process.env.API_PORT || 5001)

async function start (): Promise<void> {
  logger.info(`Starting application on port ${PORT}`)
  await initDB()

  const app = configureServer(PORT)

  nunjucks.configure({ express: app })
    .addFilter('gravatar', (email, options) => getGravatarUrl(email, options.size))
    .addFilter('datetimeformat', formatDatetime)

  // Setup routes
  app.use(metricsMiddleware)
  app.use('/', healthcheckRouter)
  app.use('/', timelineRouter)
  app.use('/', authenticationRouter)
  app.use('/', followRouter)
  app.use('/', messageRouter)
}

async function startAPI (): Promise<void> {
  logger.info(`Starting API on port ${API_PORT}`)
  await initDB()

  const app = configureServer(API_PORT)

  app.use(metricsMiddleware)
  app.use('/', healthcheckRouter)
  app.use('/', simulatorRouter)
}

function configureServer (port: number): express.Express {
  const app = express()
  app.use(express.static('static'))
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.set('trust proxy', 1)
  app.use(session({
    name: 'app.sid',
    secret: 'Very secret secret',
    resave: true,
    saveUninitialized: true,
    store: new session.MemoryStore()
  }))
  app.use(flash())

  // Begin listening for connections
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info(`Listening on ${port}`)
  }).on('error', (err) => {
    logger.error(`Unable to start server ${err}`)
  })

  const shutdown = gracefulShutdown(server)

  /* eslint-disable @typescript-eslint/no-misused-promises */
  process.on('SIGTERM', async () => {
    await shutdown()
    await killPool()
    process.exit(1)
  })
  process.on('uncaughtException', async (err): Promise<void> => handleUncaughtException(shutdown, err))
  process.on('unhandledRejection', async (reason): Promise<void> => handleUncaughtException(shutdown, reason))
  /* eslint-enable @typescript-eslint/no-misused-promises */

  return app
}

/* eslint-disable @typescript-eslint/no-floating-promises */
start()
startAPI()
