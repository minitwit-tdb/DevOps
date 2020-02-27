import { initMessage } from './MessageModel'
import { initUser } from './UserModel'
import { initFollower } from './FollowerModel'

export async function initDB (): Promise<void> {
  await Promise.all([initMessage(), initUser(), initFollower()])
}
