import { Message } from '../models'

export async function addMessage (userId: number, msgText: string, pubDate: number): Promise<void> {
  await Message.create({ author_id: userId, text: msgText, pub_date: pubDate })
}
