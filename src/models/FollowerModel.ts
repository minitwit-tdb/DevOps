import { getSequelize } from '../database'
import { User } from './UserModel'
import Sequelize = require('sequelize')

export class Follower extends Sequelize.Model {
  public who_id!: number
  public whom_id!: number
}

export async function initFollower (): Promise<void> {
  const sequelize = await getSequelize()

  Follower.init({
    who_id: { type: Sequelize.INTEGER, references: { model: User, key: 'user_id' } },
    whom_id: { type: Sequelize.INTEGER, references: { model: User, key: 'user_id' } }
  }, { sequelize, modelName: 'Follower' })
}
