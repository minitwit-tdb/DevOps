import express = require('express');
const router = express.Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).end()
})

export default router
