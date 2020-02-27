import { PER_PAGE } from '../config'
import { Message, User, IMessageModel, IUserModel } from '../models'

export async function getTweetsByUserId (userId: number, limit: number = PER_PAGE): Promise<Array<IMessageModel & IUserModel>> {
  const res = await Message.findAll({
    order: [['pub_date', 'DESC']],
    limit,
    where: {
      flagged: false,
      author_id: '$User.user_id$',
      '$User.user_id$': userId
    },
    include: [{ all: true }]
  })

  // const res = await connection.query(`
  //   SELECT user.username, user.email, message.* FROM user, message
  //   WHERE message.flagged = 0
  //     AND message.author_id = user.user_id
  //     AND user.user_id = ?
  //   ORDER BY message.pub_date desc limit ?
  // `, [userId, limit])

  // await connection.end()

  // delete res.meta

  return res
    .map((entity) => entity.get({ plain: true }) as (IMessageModel & IUserModel))
}
