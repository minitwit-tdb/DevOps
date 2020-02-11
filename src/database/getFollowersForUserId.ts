import { getConnection } from './getConnection'
import { PER_PAGE } from '../config'

export async function getFollowersForUserId (userId: number, limit: number = PER_PAGE): Promise<Array<{ username: string}>> {
  const connection = await getConnection()

  const res = await connection.query(`
    SELECT user.username FROM user
    INNER JOIN follower ON follower.whom_id=user.user_id
    WHERE follower.who_id = ?
    LIMIT ?
  `, [userId, limit])

  await connection.end()

  return res
}
