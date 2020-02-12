import { getConnection } from './getConnection'
import { IUserModel } from '../models'

export async function getUserByUsername (username?: string): Promise<IUserModel | undefined> {
  if (!username) {
    return undefined
  }

  const connection = await getConnection()

  const res = await connection.query(`
    SELECT * FROM user
    WHERE user.username = ?
  `, [username])

  await connection.end()

  return res[0] || undefined
}
