import { User } from '../models'

export function getUserBySession (sess: Express.Session | undefined): User | undefined {
  return sess && sess.user ? sess.user : undefined
}
