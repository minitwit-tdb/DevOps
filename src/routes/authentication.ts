import { getUserBySession, urlTo, verifyPassword, logger, shouldThrottleByIP, clearIp } from '../utils'
import { getUserByUsername, addUser } from '../database'

import express = require('express');
const router = express.Router()

// Registers the user.
router.all('/register', async (req, res) => {
  const self = getUserBySession(req.session)

  if (self) {
    res.redirect('/')

    return
  }

  let error: string | undefined

  if (req.method === 'POST') {
    const { body } = req

    if (!body.username || !body.email || !body.password || typeof await getUserByUsername(body.username) !== 'undefined') {
      error = 'Username, email or password was invalid'
      if (!body.username) {
        logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide a username.`)
      } else if (typeof await getUserByUsername(body.username) !== 'undefined') {
        logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} tried to register with an existing username.`)
      } else if (!body.email) {
        logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide an email.`)
      } else if (!body.password) {
        logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide an password.`)
      }
    } else if (!body.email.includes('@')) {
      error = 'You have to enter a valid email address'
      logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide a valid email.`)
    } else if (body.password !== body.password2) {
      error = 'The two passwords do not match'
      logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to match the passwords.`)
    } else {
      await addUser(body.username, body.email, body.password)
      logger.info(`Authentication.register<ALL>(): Visitor from: ${req.connection.remoteAddress} was registered with username ${body.username}.`)
      req.flash('info', 'You were successfully registered and can login now')
      res.redirect('/login')

      return
    }
  }

  res.render('templates/register.html', {
    urlTo,
    messages: req.flash('info'),
    error,
    self
  })
})

// Logs the user in.
router.all('/login', async (req, res) => {
  const self = getUserBySession(req.session)

  if (shouldThrottleByIP(req)) {
    res.render('templates/login.html', {
      urlTo,
      messages: req.flash('info'),
      error: "You've entered incorrect login information too many times in a row, please come back later.",
      self
    })

    return
  }

  if (self) {
    res.redirect('/')
    logger.info(`Authentication.login<ALL>(): Visitor from: ${req.connection.remoteAddress} logged in.`)
    return
  }

  let error: string | undefined

  if (req.method === 'POST') {
    const user = await getUserByUsername(req.body.username)

    if (!user) {
      error = 'Invalid username or password'
      logger.info(`Authentication.login<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide a valid username. ${req.body.username},${req.body.password}`)
    } else if (!verifyPassword(req.body.password, user.pw_hash)) {
      error = 'Invalid username or password'
      logger.info(`Authentication.login<ALL>(): Visitor from: ${req.connection.remoteAddress} failed to provide a valid password. ${req.body.username},${req.body.password}`)
    } else {
      req.flash('info', 'You were logged in')

      if (!req.session) {
        error = 'Unable to set user!'
        logger.info('Login(): Failed to set user!')
      } else {
        clearIp(req)
        req.session.user = user
        res.redirect('/')
        logger.info(`Authentication.login<ALL>(): Visitor from: ${req.connection.remoteAddress} logged in.`)

        return
      }
    }
  }

  res.render('templates/login.html', {
    urlTo,
    messages: req.flash('info'),
    error,
    self
  })
})

// Logs the user out
router.get('/logout', (req, res) => {
  logger.info(`Authentication.logout<ALL>(): User ${req.session && req.session.user ? `'${req.session.user.username}'` : ''} from: ${req.connection.remoteAddress} logged out.`)
  req.flash('info', 'You were logged out')

  if (req.session) {
    req.session.user = null
  }

  res.redirect('/public')
})

export default router
