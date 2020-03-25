
import { getUserByUsername, getLatestTweets, getTweetsByUserId, addMessage, getFollowersForUserId, addFollower, deleteFollower } from '../database'
import { addUser } from '../database/addUser'
import { isReqFromSimulator, logger } from '../utils'

import express = require('express');
const router = express.Router()

let LATEST = 0
const UNAUTHORIZED_MSG = 'You are not authorized to use this resource!'

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
    logger.warn(`Simulator.register<POST>(): Failed to register user!: ${error}`)
    res.status(400).json({
      status: 400,
      error_msg: error
    }).end()
  } else {
    logger.warn(`Simulator.register<POST>(): Added user with username ${body.username}`)
    await addUser(body.username, body.email, body.pwd)

    res.status(204).end()
  }
})

router.get('/msgs', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    logger.warn(`Simulator.msgs<GET>(): Attempted to get msgs with invalid credentials. ${req.connection.remoteAddress}`)
    res.status(403).json({
      status: 403,
      error_msg: UNAUTHORIZED_MSG
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
    logger.warn(`Simulator.msgs/:username<GET>(): Attempted to get msgs with invalid credentials. ${req.connection.remoteAddress}`)

    res.status(403).json({
      status: 403,
      error_msg: UNAUTHORIZED_MSG
    })

    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    logger.error(`Simulator.msgs/:username<GET>(): Unable to find user with username: ${req.params.username}`)

    res.status(404).end()
    return
  }

  const tweets = await getTweetsByUserId(user.user_id)
  logger.info(`Simulator.msgs/:username<GET>(): Found ${tweets.length} tweets for user '${req.params.username}'`)

  res.json(tweets.map((tweet) => ({
    content: tweet.text,
    pub_date: tweet.pub_date,
    user: tweet.username
  })))
})

router.post('/msgs/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    logger.warn(`Simulator.msgs/:username<POST>(): Attempted to post msgs with invalid credentials. ${req.connection.remoteAddress}`)

    res.status(403).json({
      status: 403,
      error_msg: UNAUTHORIZED_MSG
    })

    return
  }

  const { body } = req

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    logger.error(`Simulator.msgs/:username<POST>(): Unable to find user with username: ${req.params.username}`)

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

  logger.info(`Simulator.msgs/:username<GET>(): Added message for user '${user.username}'`)

  res.status(204).end()
})

router.get('/fllws/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    logger.warn(`Simulator.fllws/:username<GET>(): Attempted to get followers with invalid credentials. ${req.connection.remoteAddress}`)

    res.status(403).json({
      status: 403,
      error_msg: UNAUTHORIZED_MSG
    })

    return
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    logger.error(`Simulator.fllws/:username<GET>(): Unable to find user with username: ${req.params.username}`)

    res.status(404).end()
    return
  }

  let amount = Number(req.query.no)

  if (Number.isNaN(amount)) {
    amount = 100
  }

  const follows = await getFollowersForUserId(user.user_id)
  const followerNames = follows.map((follower) => follower.username)

  logger.info(`Simulator.msgs/:fllws<GET>(): Got ${followerNames.length} followers for user '${user.username}'`)

  res.json({
    follows: followerNames
  })
})

router.post('/fllws/:username', async (req, res) => {
  updateLatest(req)

  if (!isReqFromSimulator(req)) {
    logger.warn(`Simulator.fllws/:username<POST>(): Attempted to get followers with invalid credentials. ${req.connection.remoteAddress}`)

    res.status(403).json({
      status: 403,
      error_msg: UNAUTHORIZED_MSG
    })

    return
  }

  const user = await getUserByUsername(req.params.username)

  if (!user) {
    logger.error(`Simulator.fllws/:username<POST>(): Unable to find user with username: ${req.params.username}`)

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
      logger.warn(`Simulator.fllws/:username<POST>(): Unable to find user to follow with username: ${body.follow} for user ${user.username}`)

      res.status(500).end()
      return
    }

    await addFollower(user.user_id, toFollow.user_id)

    logger.info(`Simulator.fllws/:username<POST>(): Added follower ${body.follow} for user ${user.username}`)
    res.status(204).end()
  } else if ('unfollow' in body) {
    const toUnfollow = await getUserByUsername(body.unfollow)

    if (!toUnfollow) {
      logger.warn(`Simulator.fllws/:username<POST>(): Unable to find user to unfollow with username: ${body.follow} for user ${user.username}`)

      res.status(500).end()
      return
    }

    logger.info(`Simulator.fllws/:username<POST>(): Deleted follower ${body.follow} for user ${user.username}`)
    await deleteFollower(user.user_id, toUnfollow.user_id)

    res.status(204).end()
  }
})

export default router
