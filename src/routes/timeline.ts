import { getUserBySession, urlTo, logger } from '../utils'
import { getTweetsForUserId, getLatestTweets, getUserByUsername, isFollowingUser, getTweetsByUserId } from '../database'

import express = require('express');
const router = express.Router()

const TIMELINE_TEMPLATE = 'templates/timeline.html'

// Shows a users timeline or if no user is logged in it will
// redirect to the public timeline.  This timeline shows the user's
// messages as well as all the messages of followed users.
router.get('/', async (req, res) => {
  logger.info(`Timeline<GET>(): We got a visitor from: ${req.connection.remoteAddress}`)
  const self = getUserBySession(req.session)
  // const offset = req.query.offset

  if (!self) {
    logger.info(`Timeline<GET>(): Visitor from: ${req.connection.remoteAddress} was redirected to the public timeline.`)
    res.redirect('/public')

    return
  }

  const tweets = await getTweetsForUserId(self.user_id)

  res.render(TIMELINE_TEMPLATE, {
    tweets,
    urlTo,
    messages: req.flash('info'),
    self,
    profile_user: self,
    endpoint: req.originalUrl
  })
})

// Displays the latest messages of all users.
router.get('/public', async (req, res) => {
  logger.info(`Timeline.public<GET>(): Visitor from: ${req.connection.remoteAddress} went to look at the latest tweets of all users.`)
  const self = getUserBySession(req.session)
  const tweets = (await getLatestTweets())
    .map((tweet) => tweet.get({ plain: true }))

  res.render(TIMELINE_TEMPLATE, {
    tweets,
    urlTo,
    messages: req.flash('info'),
    self,
    endpoint: req.originalUrl
  })
})

// Display's a users tweets.
router.get('/user/:username', async (req, res) => {
  logger.info(`Timeline.user/:username<GET>(): Visitor from: ${req.connection.remoteAddress} went to look at the tweets of the following user: ${req.params.username}`)
  const self = getUserBySession(req.session)
  const user = await getUserByUsername(req.params.username)

  if (!user) {
    logger.warn(`Timeline.user/:username<GET>(): Visitor from: ${req.connection.remoteAddress} received a "Not found" error after trying to display the following user's tweets: ${req.params.username}`)
    res.status(404)
    res.send('Not found')

    return
  }

  const isFollowing = await isFollowingUser(self, user)

  const tweets = await getTweetsByUserId(user.user_id)
  res.render(TIMELINE_TEMPLATE, {
    tweets,
    urlTo,
    messages: req.flash('info'),
    following: isFollowing,
    profile_user: user,
    self,
    endpoint: req.originalUrl
  })
})

export default router
