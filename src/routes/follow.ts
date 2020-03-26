import { getUserBySession, logger } from '../utils'
import { getUserByUsername, addFollower, deleteFollower } from '../database'

import express = require('express');
const router = express.Router()

// Adds the current user as follower of the given user.
router.get('/:username/follow', async (req, res) => {
  const self = getUserBySession(req.session)

  if (!self) {
    logger.warn(`Follow.:username/follow<GET>(): Visitor from: ${req.connection.remoteAddress} attempted to follow an user and received an "Unauthorized" error.`)
    res.status(401).send('Unauthorized')
    return
  }

  const toFollow = await getUserByUsername(req.params.username)

  if (!toFollow) {
    logger.warn(`Follow.:username/follow<GET>(): Visitor from: ${req.connection.remoteAddress} received a "Cannot follow nonexistant user" error after trying to follow an user with the following username: ${req.params.username}`)
    res.status(404).send('Cannot follow nonexistent user')
    return
  }

  await addFollower(self.user_id, toFollow.user_id)
  logger.info(`Follow.:username/follow<GET>(): Visitor from: ${req.connection.remoteAddress} followed this user: ${toFollow.username}, id: ${toFollow.user_id}`)
  req.flash('info', `You are now following ${toFollow.username}`)
  res.redirect(`/user/${toFollow.username}`)
})

// Removes the current user as follower of the given user.
router.get('/:username/unfollow', async (req, res) => {
  const self = getUserBySession(req.session)

  if (!self) {
    logger.warn(`Follow.:username/unfollow<GET>(): Visitor from: ${req.connection.remoteAddress} attempted to unfollow an user and received an "Unauthorized" error.`)
    res.status(401).send('Unauthorized')
    return
  }

  const toFollow = await getUserByUsername(req.params.username)

  if (!toFollow) {
    logger.warn(`Follow.:username/unfollow<GET>(): Visitor from: ${req.connection.remoteAddress} received a "Cannot unfollow nonexistant user" error after trying to unfollow an user with the following username: ${req.params.username}`)
    res.status(404).send('Cannot unfollow nonexistent user')
    return
  }

  await deleteFollower(self.user_id, toFollow.user_id)
  logger.info(`Follow.:username/unfollow<GET>(): Visitor from: ${req.connection.remoteAddress} unfollowed this user: ${toFollow.username}, id: ${toFollow.user_id}`)
  req.flash('info', `You are no longer following ${toFollow.username}`)
  res.redirect(`/user/${toFollow.username}`)
})

export default router
