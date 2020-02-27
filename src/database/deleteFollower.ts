import { Follower } from '../models'

export async function deleteFollower (whoId: number, whomId: number): Promise<void> {
  await Follower.destroy({
    where: {
      who_id: whoId,
      whom_id: whomId
    }
  })
}
