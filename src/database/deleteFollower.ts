import { getConnection } from './getConnection'

export async function deleteFollower (whoId: number, whomId: number): Promise<boolean> {
  const connection = await getConnection()

  const res = await connection.query(`
    DELETE FROM follower WHERE who_id=? and whom_id=?
  `, [whoId, whomId])

  await connection.end()

  return res
}
