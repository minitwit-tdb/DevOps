import { PER_PAGE } from '../config'
import { User, Follower } from '../models'

export async function getFollowersForUserId (userId: number, limit: number = PER_PAGE): Promise<User[]> {
  return User.findAll({
    limit,
    where: {
      '$Follower.who_id': userId
    },
    include: [{ model: Follower, as: 'Follower', where: { whom_id: '$User.user_id' } }]
  })
}
