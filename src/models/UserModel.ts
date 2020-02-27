import { getSequelize } from '../database'
import Sequelize = require('sequelize')

export class User extends Sequelize.Model {
  public user_id!: number
  public username!: string
  public email!: string
  public pw_hash!: string
}

export async function initUser (): Promise<void> {
  const sequelize = await getSequelize()

  User.init({
    user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    pw_hash: Sequelize.STRING
  }, { sequelize, modelName: 'User' })
}
