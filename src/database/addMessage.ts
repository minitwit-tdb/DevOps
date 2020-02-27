import { Message } from '../models'

export async function addMessage (userId: number, text: string, pubDate: number): Promise<void> {
  await Message.create({
    author_id: userId,
    text: text,
    pub_date: pubDate
  })
}
