import { getSequelize } from '../database'
import Sequelize = require('sequelize')

export interface IUserModel {
  user_id: number
  username: string
  email: string
  pw_hash: string
}

export class User extends Sequelize.Model {
  public getTyped (): IUserModel {
    return this.get() as IUserModel
  }
}

export async function initUser (): Promise<void> {
  const sequelize = await getSequelize()

  User.init({
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    pw_hash: Sequelize.DATE
  }, { sequelize, modelName: 'user' })
}
