
import { getUserByUsername, getLatestTweets, getTweetsByUserId, addMessage, getFollowersForUserId, addFollower, deleteFollower } from '../database'
import { addUser } from '../database/addUser'
import { isReqFromSimulator } from '../utils'

import express = require('express');
const router = express.Router()

let LATEST = 0

function updateLatest (req: express.Request): void {
  const latest = Number(req.query.latest)

  if (!Number.isNaN(latest)) {
    LATEST = latest
  }
}

router.get('/latest', (req, res) => {
  updateLatest(req)
  res.json({
    latest: LATEST
  })
})

router.post('/register', async (req, res) => {
  updateLatest(req)
  const { body } = req

  let error: string = ''

  if (!body.username) {
    error = 'You have to enter a username'
  } else if (!body.email || !body.email.includes('@')) {
    error = 'You have to enter a valid email address'
  } else if (!body.pwd) {
    error = 'You have to enter a password'
  } else if (typeof await getUserByUsername(body.username) !== 'undefined') {
    error = 'The username is already taken'
  }

  if (error) {
    res.status(400).json({
      status: 400,
      error_msg: error
    }).end()
  } else {
    await addUser(body.username, body.email, body.pwd)

    res.status(204).end()
  }
})

router.get('/msgs', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    res.status(403).json({
      status: 403,
      error_msg: 'You are not authorized to use this resource!'
    })

    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const tweets = await getLatestTweets(amount)

  res.json(tweets.map((tweet) => ({
    content: tweet.text,
    pub_date: tweet.pub_date,
    user: tweet.User.username
  })))
})

router.get('/msgs/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    res.status(403).json({
      status: 403,
      error_msg: 'You are not authorized to use this resource!'
    })

    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    res.status(404).end()
    return
  }

  const tweets = await getTweetsByUserId(user.user_id)

  res.json(tweets.map((tweet) => ({
    content: tweet.text,
    pub_date: tweet.pub_date,
    user: tweet.username
  })))
})

router.post('/msgs/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    res.status(403).json({
      status: 403,
      error_msg: 'You are not authorized to use this resource!'
    })

    return
  }

  const { body } = req

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    res.status(404).end()
    return
  }

  if (!body.content) {
    res.status(502).json({
      status: 502,
      error_msg: 'Unable to add message without and content'
    })
  }

  await addMessage(user.user_id, body.content, Date.now())

  res.status(204).end()
})

router.get('/fllws/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    res.status(403).json({
      status: 403,
      error_msg: 'You are not authorized to use this resource!'
    })

    return
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    res.status(404).end()
    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const follows = await getFollowersForUserId(user.user_id)
  const followerNames = follows.map((follower) => follower.username)

  res.json({
    follows: followerNames
  })
})

router.post('/fllws/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    res.status(403).json({
      status: 403,
      error_msg: 'You are not authorized to use this resource!'
    })

    return
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    res.status(404).end()
    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const { body } = req

  if ('follow' in body) {
    const toFollow = await getUserByUsername(body.follow)

    if (!toFollow) {
      res.status(500).end()
      return
    }

    await addFollower(user.user_id, toFollow.user_id)

    res.status(204).end()
  } else if ('unfollow' in body) {
    const toUnfollow = await getUserByUsername(body.unfollow)

    if (!toUnfollow) {
      res.status(500).end()
      return
    }

    await deleteFollower(user.user_id, toUnfollow.user_id)

    res.status(204).end()
  }
})

export default router
