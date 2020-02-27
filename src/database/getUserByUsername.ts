import { User } from '../models'

export async function getUserByUsername (username?: string): Promise<User | undefined> {
  if (!username) {
    return undefined
  }

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    return user
  }
}
