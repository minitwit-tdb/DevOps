import Sequelize = require('sequelize');

let sequelize: Sequelize.Sequelize

export async function getSequelize (): Promise<Sequelize.Sequelize> {
  if (!sequelize) {
    try {
      const fallback = await require('../mariadb.json')

      sequelize = new Sequelize.Sequelize(
        process.env.MYSQL_DATABASE || fallback.database,
        process.env.MYSQL_ROOT_PASSWORD || fallback.password,
        process.env.MYSQL_ROOT_PASSWORD || fallback.password,
        {
          host: process.env.MYSQL_HOST || fallback.host,
          dialect: 'mariadb'
        }
      )
    } catch {
      // In case we cannot find our fallback file, then simply attempt to login
      // to mariaDB using environment variables.
      sequelize = new Sequelize.Sequelize(
        String(process.env.MYSQL_DATABASE),
        String(process.env.MYSQL_ROOT_PASSWORD),
        String(process.env.MYSQL_ROOT_PASSWORD),
        {
          host: process.env.MYSQL_HOST,
          dialect: 'mariadb'
        }
      )
    }
  }

  return sequelize
}

export async function killPool (): Promise<void> {
  await sequelize.close()
}
