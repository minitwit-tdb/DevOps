import { PER_PAGE } from '../config'
import { User, Message, Follower } from '../models'
import Sequelize = require('sequelize')

export async function getTweetsForUserId (userId: number): Promise<Array<Message & User>> {
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
      [Sequelize.Op.or]: [{ '$User.user_id': userId }, { '$User.user_id': { [Sequelize.Op.in]: followers.map((follower) => follower.whom_id) } }]
    },
    include: [{ model: User, as: 'User' }]
  })

  return res as Array<Message & User>
}
