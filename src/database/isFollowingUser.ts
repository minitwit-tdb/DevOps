import { getConnection } from './getConnection'
import { IUserModel } from '../models'

export async function isFollowingUser (self?: IUserModel, user?: IUserModel): Promise<boolean> {
  if (!self || !self.user_id || !user || !user.user_id) {
    return false
  }

  const connection = await getConnection()

  const res = await connection.query(`
    SELECT * FROM follower
    WHERE follower.who_id = ? 
      AND follower.whom_id = ?
  `, [self.user_id, user.user_id])

  await connection.end()

  return !!res[0]
}
