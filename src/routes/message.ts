import { getUserBySession } from '../utils'
import { addMessage } from '../database'

import express = require('express');
const router = express.Router()

// Registers a new message for the user.
router.post('/addMessage', async (req, res) => {
  const self = getUserBySession(req.session)

  if (!self) {
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
