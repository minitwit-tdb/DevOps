import { handleUncaughtException } from './utils/handleUncaughtException'
import { timelineRouter, simulatorRouter, authenticationRouter, followRouter, messageRouter } from './routes'
import { bootstrapDB, killPool } from './database'
import { formatDatetime, getGravatarUrl } from './utils'

import express = require('express')
import gracefulShutdown = require('http-graceful-shutdown')
import session = require('express-session')
import nunjucks = require('nunjucks')
import flash = require('express-flash')
import cookieParser = require('cookie-parser')
import bodyParser = require('body-parser')

const PORT = process.env.PORT || process.env.SIMULATOR ? 5001 : 3000

async function start (): Promise<void> {
  await bootstrapDB()

  const app = configureServer()

  nunjucks.configure({ express: app })
    .addFilter('gravatar', (email, options) => getGravatarUrl(email, options.size))
    .addFilter('datetimeformat', formatDatetime)

  // Setup routes
  if (process.env.SIMULATOR) {
    app.use('/', simulatorRouter)
  } else {
    app.use('/', timelineRouter)
    app.use('/', authenticationRouter)
    app.use('/', followRouter)
    app.use('/', messageRouter)
  }
}

function configureServer (): express.Express {
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
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })

  const shutdown = gracefulShutdown(server)

  /* eslint-disable @typescript-eslint/no-misused-promises */
  process.on('SIGTERM', killPool)
  process.on('uncaughtException', async (err): Promise<void> => handleUncaughtException(shutdown, err))
  process.on('unhandledRejection', async (reason): Promise<void> => handleUncaughtException(shutdown, reason))
  /* eslint-enable @typescript-eslint/no-misused-promises */

  return app
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start()
