import { getConnection } from './getConnection'

export async function addMessage (userId: number, text: string, pubDate: number): Promise<boolean> {
  const connection = await getConnection()

  const res = await connection.query(`
    INSERT INTO 
      message (author_id, text, pub_date, flagged)
    VALUES
      (?, ?, ?, 0);
  `, [userId, text, pubDate])

  await connection.end()

  return res
}
