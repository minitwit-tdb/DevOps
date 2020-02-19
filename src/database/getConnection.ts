import * as fallback from '../mariadb.json'
import mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.MYSQL_HOST || fallback.host,
  user: process.env.MYSQL_USER || fallback.user,
  password: process.env.MYSQL_ROOT_PASSWORD || fallback.password,
  database: process.env.MYSQL_DATABASE || fallback.database
})

export async function getConnection (): Promise<mariadb.Connection> {
  return pool.getConnection()
}

export async function killPool (): Promise<void> {
  await pool.end()
}
