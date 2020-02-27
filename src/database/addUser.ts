import { generatePasswordHash } from '../utils'
import { User } from '../models'

export async function addUser (username: string, email: string, pwd: string): Promise<void> {
  await User.create({
    username,
    email,
    pw_hash: generatePasswordHash(pwd)
  })
}
