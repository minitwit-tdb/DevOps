import path = require('path')

export function rootDir (): string {
  return path.resolve(__dirname, '..')
}
