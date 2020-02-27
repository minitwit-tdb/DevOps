import { Follower, User } from '../models'

export async function isFollowingUser (self?: User, user?: User): Promise<boolean> {
  if (!self || !self.user_id || !user || !user.user_id) {
    return false
  }

  const res = await Follower.findOne({
    where: {
      who_id: self.user_id,
      whom_id: user.user_id
    }
  })

  return !!res
}
