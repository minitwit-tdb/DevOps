import { Follower } from '../models'

export async function addFollower (whoId: number, whomId: number): Promise<void> {
  await Follower.create({ who_id: whoId, whom_id: whomId })
}
