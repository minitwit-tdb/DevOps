import { CRYPTO_CONFIG } from '../config'

import crypto = require('crypto')

export function generatePasswordHash (password: string): string {
  return crypto.pbkdf2Sync(password, CRYPTO_CONFIG.salt, CRYPTO_CONFIG.iterations, CRYPTO_CONFIG.length, CRYPTO_CONFIG.algorithm).toString('hex')
}
