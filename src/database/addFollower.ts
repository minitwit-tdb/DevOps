// import { getConnection } from './getConnection'
/*
export async function addFollower (whoId: number, whomId: number): Promise<boolean> {
  const connection = await getConnection()

  const res = await connection.query(`
    INSERT INTO follower (who_id, whom_id) VALUES (?, ?);
  `, [whoId, whomId])

  await connection.end()

  return res
}
*/
import './models'
import { Follower } from '../models'

export async function addFollower (whoId: number, whomId: number): Promise<void> {
  await Follower.create({ who_id: whoId, whom_id: whomId })
}
