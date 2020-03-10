import register, { CPU_GAUGE, RESPONSE_COUNTER, REQ_DURATION_SUMMARY } from '../utils/metrics'
import os = require('os-utils')
import express = require('express')

const router = express.Router()

let requestStart: number

export function beforeRequest (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.hostname !== 'server' && req.url !== '/metrics') {
    requestStart = Date.now()
  }

  os.cpuUsage((percentage) => {
    CPU_GAUGE.set(percentage)
  })

  next()
}

export function afterRequest (req: express.Request, res: express.Response, next: express.NextFunction): void {
  function after (): void {
    if (req.hostname !== 'server' && req.url !== '/metrics') {
      const elapsed = Date.now() - requestStart
      RESPONSE_COUNTER.inc()
      REQ_DURATION_SUMMARY.observe(elapsed)
    }
  }

  res.on('finish', after)

  next()
}

router.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(register.metrics())
})

export default router
