import { handleUncaughtException } from './utils/handleUncaughtException'
import { timelineRouter, simulatorRouter, authenticationRouter, followRouter, messageRouter, healthcheckRouter, metricRouter } from './routes'
import { killPool } from './database'
import { formatDatetime, getGravatarUrl } from './utils'
import { initDB } from './models'
import { beforeRequest, afterRequest } from './routes/metrics'

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
  console.log(`Starting application on port ${PORT}`)
  await initDB()

  const app = configureServer(PORT)

  nunjucks.configure({ express: app })
    .addFilter('gravatar', (email, options) => getGravatarUrl(email, options.size))
    .addFilter('datetimeformat', formatDatetime)

  // Setup routes
  app.use(beforeRequest)
  app.use(afterRequest)
  app.use('/', healthcheckRouter)
  app.use('/', timelineRouter)
  app.use('/', authenticationRouter)
  app.use('/', followRouter)
  app.use('/', messageRouter)
}

async function startAPI (): Promise<void> {
  console.log(`Starting API on port ${API_PORT}`)
  await initDB()

  const app = configureServer(API_PORT)

  app.use(beforeRequest)
  app.use(afterRequest)
  app.use('/', healthcheckRouter)
  app.use('/', simulatorRouter)
  app.use('/', metricRouter)
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
    console.log(`Listening on port ${port}`)
  }).on('error', (err) => {
    console.error(err)
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
