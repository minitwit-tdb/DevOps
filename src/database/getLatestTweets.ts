import { getConnection } from './getConnection'
import { PER_PAGE } from '../config'
import { IMessageModel } from '../models'

export async function getLatestTweets (): Promise<IMessageModel[]> {
  const connection = await getConnection()

  const res = await connection.query(`
    SELECT user.username, user.email, message.* FROM user, message
    WHERE message.flagged = 0 
      AND message.author_id = user.user_id
    ORDER BY message.pub_date desc limit ?
  `, [PER_PAGE])

  await connection.end()

  return res
}
