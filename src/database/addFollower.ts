import { getConnection } from './getConnection'

export async function addFollower (whoId: number, whomId: number): Promise<boolean> {
  const connection = await getConnection()

  const res = await connection.query(`
    INSERT INTO follower (who_id, whom_id) VALUES (?, ?);
  `, [whoId, whomId])

  await connection.end()

  return res
}
