import mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

export async function getConnection (): Promise<mariadb.Connection> {
  return pool.getConnection()
}

export async function killPool (): Promise<void> {
  await pool.end()
}
