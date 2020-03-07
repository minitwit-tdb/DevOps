import register from '../utils/metrics'
import express = require('express');
const router = express.Router()

router.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(register.metrics())
})

export default router
