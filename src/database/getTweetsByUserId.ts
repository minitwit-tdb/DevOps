import { PER_PAGE } from '../config'
import { Message, User } from '../models'

export async function getTweetsByUserId (userId: number, limit: number = PER_PAGE): Promise<Array<Message & User>> {
  const res = await Message.findAll({
    order: [['pub_date', 'DESC']],
    limit,
    where: {
      flagged: false,
      author_id: '$User.user_id$',
      '$User.user_id$': userId
    },
    include: [{ model: User, as: 'User' }]
  })

  return res as Array<Message & User>
}
