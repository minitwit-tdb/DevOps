import { getUserBySession, urlTo } from '../utils'
import { getTweetsForUserId, getLatestTweets, getUserByUsername, isFollowingUser, getTweetsByUserId } from '../database'

import express = require('express');
const router = express.Router()

// Shows a users timeline or if no user is logged in it will
// redirect to the public timeline.  This timeline shows the user's
// messages as well as all the messages of followed users.
router.get('/', async (req, res) => {
  console.log(`We got a visitor from: ${req.connection.remoteAddress}`)
  const self = getUserBySession(req.session)
  // const offset = req.query.offset

  if (!self) {
    res.redirect('/public')

    return
  }

  const tweets = await getTweetsForUserId(self.user_id)

  res.render('templates/timeline.html', {
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
  const self = getUserBySession(req.session)
  const tweets = await getLatestTweets()

  res.render('templates/timeline.html', {
    tweets,
    urlTo,
    messages: req.flash('info'),
    self,
    endpoint: req.originalUrl
  })
})

// Display's a users tweets.
router.get('/user/:username', async (req, res) => {
  const self = getUserBySession(req.session)
  const user = await getUserByUsername(req.params.username)

  if (!user) {
    res.status(404)
    res.send('Not found')

    return
  }

  const isFollowing = await isFollowingUser(self, user)

  const tweets = await getTweetsByUserId(user.user_id)
  res.render('templates/timeline.html', {
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
