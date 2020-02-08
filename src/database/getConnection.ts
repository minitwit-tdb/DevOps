import * as configuration from '../mariadb.json'
import mariadb = require('mariadb');

const pool = mariadb.createPool(configuration)

export async function getConnection (): Promise<mariadb.Connection> {
  return pool.getConnection()
}
