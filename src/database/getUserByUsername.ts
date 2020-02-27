import { IUserModel, User } from '../models'

export async function getUserByUsername (username?: string): Promise<IUserModel | undefined> {
  if (!username) {
    return undefined
  }

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    return user.get({ plain: true }) as IUserModel
  }
}
