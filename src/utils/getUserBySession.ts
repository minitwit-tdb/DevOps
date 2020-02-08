import { IUserModel } from '../models'

export function getUserBySession (sess: Express.Session | undefined): IUserModel | undefined {
  return sess && sess.user ? sess.user : undefined
}
