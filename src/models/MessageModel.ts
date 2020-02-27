import { getSequelize } from '../database'
import { User } from './UserModel'
import Sequelize = require('sequelize')

export interface IMessageModel {
  message_id: string
  author_id: string
  text: string
  pub_date: string
}

export class Message extends Sequelize.Model {}

export async function initMessage (): Promise<void> {
  const sequelize = await getSequelize()

  Message.init({
    message_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    author_id: { type: Sequelize.INTEGER, references: { model: User, key: 'user_id' } },
    text: Sequelize.STRING,
    pub_date: Sequelize.DATE
  }, { sequelize, modelName: 'message' })
}
