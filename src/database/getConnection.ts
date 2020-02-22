import mariadb = require('mariadb');

let pool: mariadb.Pool

export async function getConnection (): Promise<mariadb.Connection> {
  if (!pool) {
    try {
      const fallback = await require('../mariadb.json')

      pool = mariadb.createPool({
        host: process.env.MYSQL_HOST || fallback.host,
        user: process.env.MYSQL_USER || fallback.user,
        password: process.env.MYSQL_ROOT_PASSWORD || fallback.password,
        database: process.env.MYSQL_DATABASE || fallback.database
      })
    } catch {
      // In case we cannot find our fallback file, then simply attempt to login
      // to mariaDB using environment variables.
      pool = mariadb.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE
      })
    }
  }

  return pool.getConnection()
}

export async function killPool (): Promise<void> {
  await pool.end()
}
