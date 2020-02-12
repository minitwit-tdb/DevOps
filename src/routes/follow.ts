import { getUserBySession } from '../utils'
import { getUserByUsername, addFollower, deleteFollower } from '../database'

import express = require('express');
const router = express.Router()

// Adds the current user as follower of the given user.
router.get('/:username/follow', async (req, res) => {
  const self = getUserBySession(req.session)

  if (!self) {
    res.status(401).send('Unauthorized')
    return
  }

  const toFollow = await getUserByUsername(req.params.username)

  if (!toFollow) {
    res.status(404).send('Cannot follow nonexistent user')
    return
  }

  await addFollower(self.user_id, toFollow.user_id)
  req.flash('info', `You are now following ${toFollow.username}`)
  res.redirect(`/user/${toFollow.username}`)
})

// Removes the current user as follower of the given user.
router.get('/:username/unfollow', async (req, res) => {
  const self = getUserBySession(req.session)

  if (!self) {
    res.status(401).send('Unauthorized')
    return
  }

  const toFollow = await getUserByUsername(req.params.username)

  if (!toFollow) {
    res.status(404).send('Cannot unfollow nonexistent user')
    return
  }

  await deleteFollower(self.user_id, toFollow.user_id)
  req.flash('info', `You are no longer following ${toFollow.username}`)
  res.redirect(`/user/${toFollow.username}`)
})

export default router
