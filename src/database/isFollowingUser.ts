import { Follower, IUserModel } from '../models'

export async function isFollowingUser (self?: IUserModel, user?: IUserModel): Promise<boolean> {
  if (!self || !self.user_id || !user || !user.user_id) {
    return false
  }

  await Follower.findOne({
    where: {
      who_id: self.user_id,
      whom_id: user.user_id
    }
  })

  return true
}
