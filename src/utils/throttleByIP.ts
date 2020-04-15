import { Request } from 'express'
import { logger } from './logger'

interface IPAccess {
  attempts: number
  startedAt: number
}

const LIMIT_DURATION = 10 * 60 * 1000
const ATTEMPT_LIMIT = 5

const accessMap: Map<string, IPAccess> = new Map()

export function shouldThrottleByIP (req: Request): boolean {
  const ip = req.connection.remoteAddress

  // In case we cannot access the remote ip, then something suspicious is going
  // on and hence we throttle access regardless.
  if (!ip) {
    return true
  }

  const accessData = accessMap.get(ip)

  if (accessData) {
    // In case the current IP has passed the limiting duration, then reset its
    // throttling
    if (Date.now() - accessData.startedAt > LIMIT_DURATION) {
      accessMap.set(ip, {
        attempts: 1,
        startedAt: Date.now()
      })
    } else {
      // ... else if the IP has exceeded the attempt limit, then block access
      if (accessData.attempts >= ATTEMPT_LIMIT) {
        return true
      } else {
        if (accessData.attempts + 1 === ATTEMPT_LIMIT) {
          logger.info(`Authentication.throttleByIP(): Throttled IP ${req.connection.remoteAddress}`)
        }

        // ... else simply bump the logged amount of attempts
        accessMap.set(ip, {
          attempts: accessData.attempts + 1,
          startedAt: accessData.startedAt
        })
      }
    }
  } else {
    // In case this is the first vist from this ip, then begin storing data
    accessMap.set(ip, {
      attempts: 1,
      startedAt: Date.now()
    })
  }

  return false
}

export function clearIp (req: Request): void {
  if (req.connection.remoteAddress) {
    accessMap.delete(req.connection.remoteAddress)
  }
}
