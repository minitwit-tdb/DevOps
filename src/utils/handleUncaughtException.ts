import { killPool } from '../database'
import { logger } from '../utils'

export async function handleUncaughtException (shutdown: () => Promise<void>, err: unknown): Promise<void> {
  if (err instanceof Error) {
    logger.error('(Uncaught exception) ' + err.message + ' Stack:' + err.stack)
    console.error('Uncaught exception: ', err.message)
    console.error(err.stack)
  } else {
    logger.error('(Uncaught exception) ' + err)
    console.error('Uncaught exception: ', err)
  }

  await shutdown()
  await killPool()
  process.exit(1)
}
