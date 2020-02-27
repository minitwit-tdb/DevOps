import { PER_PAGE } from '../config'
import { IMessageModel, User, Message, Follower, IFollower } from '../models'
import Sequelize = require('sequelize')

export async function getTweetsForUserId (userId: number): Promise<Array<Message & IMessageModel>> {
  const followers = await Follower.findAll({
    where: {
      who_id: userId
    }
  })

  const res = await Message.findAll({
    order: [['pub_date', 'DESC']],
    limit: PER_PAGE,
    where: {
      flagged: false,
      author_id: '$User.user_id$',
      [Sequelize.Op.or]: [{ '$User.user_id': userId }, { '$User.user_id': { [Sequelize.Op.in]: followers.map((follower) => (follower as unknown as IFollower).whom_id) } }]
    },
    include: [{ model: User, as: 'User' }]
  })

  return res as Array<Message & IMessageModel>
}
