import { PER_PAGE } from '../config'
import { Message, User } from '../models'

export async function getLatestTweets (limit: number = PER_PAGE): Promise<Message[]> {
  const res = await Message.findAll({
    order: [['pub_date', 'DESC']],
    limit,
    where: {
      flagged: false
    },
    include: [{ model: User, as: 'User' }]
  })

  return res
}
