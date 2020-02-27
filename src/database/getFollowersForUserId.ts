// import { getConnection } from './getConnection'
import { PER_PAGE } from '../config'
import { Follower, User } from '../models'
/*
export async function getFollowersForUserId (userId: number, limit: number = PER_PAGE): Promise<Array<{ username: string}>> {
  const connection = await getConnection()

  const res = await connection.query(`
    SELECT user.username FROM user
    INNER JOIN follower ON follower.whom_id=user.user_id
    WHERE follower.who_id = ?
    LIMIT ?
  `, [userId, limit])

  await connection.end()

  return res
}
*/

export async function getFollowersForUserId (userId: number, limit: number = PER_PAGE): Promise<User[]> {
  const res = await User.findAll({
    attributes: ['username'],
    where: { user_id: userId },
    include: [{
      model: Follower,
      where: { who_id: userId }
    }]
  })
  return res
}
