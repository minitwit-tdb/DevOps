import { getUserBySession, logger } from '../utils'
import { addMessage } from '../database'

import express = require('express');
const router = express.Router()

// Registers a new message for the user.
router.post('/addMessage', async (req, res) => {
  logger.info(`Message.addMessage<POST>(): Visitor from: ${req.connection.remoteAddress} registered a new message: ${req.body.text}`)
  const self = getUserBySession(req.session)

  if (!self) {
    logger.warn(`Message.addMessage<POST>(): Visitor from: ${req.connection.remoteAddress} attempted to make a new message and received an "Unauthorized" error.`)
    res.status(401).send('Unauthorized')

    return
  }

  if (req.body.text) {
    await addMessage(self.user_id, req.body.text, Date.now())
    req.flash('info', 'Your message was recorded')
  }

  res.redirect('/')
})

export default router
