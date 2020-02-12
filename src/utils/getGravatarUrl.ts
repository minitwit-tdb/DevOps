import crypto = require('crypto')

export function getGravatarUrl (email: string, size = 80): string {
  const md5Email = crypto.createHash('md5').update(email).digest('hex')

  return `http://www.gravatar.com/avatar/${md5Email}?d=identicon&s=${size}`
}
