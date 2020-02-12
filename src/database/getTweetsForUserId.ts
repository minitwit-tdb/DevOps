import { getConnection } from './getConnection'
import { PER_PAGE } from '../config'
import { IMessageModel } from '../models'

export async function getTweetsForUserId (userId: number): Promise<IMessageModel[]> {
  const connection = await getConnection()

  const res = await connection.query(`
    SELECT user.username, user.email, message.* FROM user, message
    WHERE message.flagged = 0 
      AND message.author_id = user.user_id
      AND (
        user.user_id = ?
        OR user.user_id in (select whom_id from follower where who_id = ?)
      )
    ORDER BY message.pub_date desc limit ?
  `, [userId, userId, PER_PAGE])

  await connection.end()

  return res
}
