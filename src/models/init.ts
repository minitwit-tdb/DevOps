import { initMessage } from './MessageModel'
import { initUser } from './UserModel'
import { initFollower } from './FollowerModel'
import { getSequelize } from '../database'

export async function initDB (): Promise<void> {
  await initUser()
  await initMessage()
  await initFollower()

  const sequelize = await getSequelize()

  await sequelize.sync({ force: true })
}
