import { getUserBySession, urlTo, verifyPassword } from '../utils'
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

    if (!body.username) {
      error = 'You have to enter a username'
    } else if (!body.email || !body.email.includes('@')) {
      error = 'You have to enter a valid email address'
    } else if (!body.password) {
      error = 'You have to enter a password'
    } else if (body.password !== body.password2) {
      error = 'The two passwords do not match'
    } else if (typeof await getUserByUsername(body.username) !== 'undefined') {
      error = 'The username is already taken'
    } else {
      await addUser(body.username, body.email, body.password)
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

  if (self) {
    res.redirect('/')

    return
  }

  let error: string | undefined

  if (req.method === 'POST') {
    const user = await getUserByUsername(req.body.username)

    if (!user) {
      error = 'Invalid username'
    } else if (!verifyPassword(req.body.password, user.pw_hash)) {
      error = 'Invalid password'
    } else {
      req.flash('info', 'You were logged in')

      if (!req.session) {
        error = 'Unable to set user!'
      } else {
        req.session.user = user
        res.redirect('/')

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
  req.flash('info', 'You were logged out')

  if (req.session) {
    req.session.user = null
  }

  res.redirect('/public')
})

export default router
