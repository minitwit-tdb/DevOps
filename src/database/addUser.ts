import { getConnection } from './getConnection'
import { generatePasswordHash } from '../utils'

export async function addUser (username: string, email: string, pwd: string): Promise<boolean> {
  const connection = await getConnection()

  const res = await connection.query(`
    INSERT INTO user
      (username, email, pw_hash)
    VALUES
      (?, ?, ?);
  `, [username, email, generatePasswordHash(pwd)])

  await connection.end()

  return res
}
