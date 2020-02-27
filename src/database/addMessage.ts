import { Message } from '../models'
/*
export async function addMessage (userId: number, text: string, pubDate: number): Promise<void> {
  await Message.create({
    author_id: userId,
    text: text,
    pub_date: pubDate
  })
}
*/

/*
  message_id: string
  author_id: string
  text: string
  pub_date: string
*/

export async function addMessage (userId: number, msgText: string, pubDate: number): Promise<void> {
  await Message.create({ author_id: userId, text: msgText, pub_date: pubDate })
}
