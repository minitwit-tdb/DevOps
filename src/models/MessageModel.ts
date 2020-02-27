import { getSequelize } from '../database'
import { User } from './UserModel'
import Sequelize = require('sequelize')

export class Message extends Sequelize.Model {
  public message_id!: string
  public author_id!: string
  public text!: string
  public pub_date!: string
}

export async function initMessage (): Promise<void> {
  const sequelize = await getSequelize()

  Message.init({
    message_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    author_id: { type: Sequelize.INTEGER, references: { model: User, key: 'user_id' } },
    text: Sequelize.STRING,
    pub_date: Sequelize.DATE
  }, { sequelize, modelName: 'message' })
}
