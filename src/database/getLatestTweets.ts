import { PER_PAGE } from '../config'
import { Message, User } from '../models'

export async function getLatestTweets (limit: number = PER_PAGE): Promise<Array<Message & User>> {
  const res = await Message.findAll({
    order: [['pub_date', 'DESC']],
    limit,
    where: {
      flagged: false,
      author_id: '$User.user_id$'
    },
    include: [{ model: User, as: 'User' }]
  })

  console.log('HELLO!', res)

  return res as unknown as Array<Message & User>
}
