import { Request } from 'express'

export function isReqFromSimulator (req: Request): boolean {
  const { authorization } = req.headers

  return authorization === 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh'
}
