import Sequelize = require('sequelize');

let sequelize: Sequelize.Sequelize

export async function getSequelize (): Promise<Sequelize.Sequelize> {
  if (!sequelize) {
    try {
      const fallback = await require('../../mariadb.json')

      sequelize = new Sequelize.Sequelize(
        process.env.MYSQL_DATABASE || fallback.database,
        process.env.MYSQL_USER || fallback.user,
        process.env.MYSQL_ROOT_PASSWORD || fallback.password,
        {
          host: process.env.MYSQL_HOST || fallback.host,
          password: process.env.MYSQL_ROOT_PASSWORD || fallback.password,
          username: process.env.MYSQL_USER || fallback.user,
          database: process.env.MYSQL_DATABASE || fallback.database,
          dialect: 'mariadb',
          timezone: 'Etc/GMT0',
          dialectOptions: {
            timezone: 'Etc/GMT0'
          }
        }
      )
    } catch (err) {
      // In case we cannot find our fallback file, then simply attempt to login
      // to mariaDB using environment variables.
      sequelize = new Sequelize.Sequelize(
        String(process.env.MYSQL_DATABASE),
        String(process.env.MYSQL_USER),
        String(process.env.MYSQL_ROOT_PASSWORD),
        {
          host: String(process.env.MYSQL_HOST),
          password: String(process.env.MYSQL_ROOT_PASSWORD),
          username: String(process.env.MYSQL_USER),
          database: String(process.env.MYSQL_DATABASE),
          dialect: 'mariadb',
          timezone: 'Etc/GMT0',
          dialectOptions: {
            timezone: 'Etc/GMT0'
          }
        }
      )
    }
  }

  return sequelize
}

export async function killPool (): Promise<void> {
  await sequelize.close()
}
