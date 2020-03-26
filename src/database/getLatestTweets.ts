import { PER_PAGE } from '../config'
import { getSequelize } from './getSequelize'
import sequlize = require('sequelize')

interface RawMessage {
  message_id: string
  author_id: string
  text: string
  pub_date: string
  flagged: boolean
  User: {
    user_id: string
    username: string
    email: string
  }
}

export async function getLatestTweets (limit: number = PER_PAGE): Promise<RawMessage[]> {
  const sq = await getSequelize()

  return sq.query({
    query: `
      SELECT Messages.*, Users.* from Messages
        LEFT JOIN Users ON Messages.author_id = Users.user_id
        ORDER BY Messages.message_id DESC 
        LIMIT ?
    `,
    values: [limit]
  }, { type: sequlize.QueryTypes.SELECT, raw: true }).map((message: any) => ({
    message_id: message.message_id,
    author_id: message.author_id,
    text: message.text,
    pub_date: message.pub_date,
    flagged: message.flagged === 1,
    User: {
      user_id: message.user_id,
      username: message.username,
      email: message.email
    }
  }))
}
