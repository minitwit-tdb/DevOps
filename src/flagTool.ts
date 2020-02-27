import { getSequelize, killPool } from './database'
import { Message, initDB } from './models'
import sequelize = require('sequelize')

async function flagTool (): Promise<void> {
  const action = process.argv[2]

  await initDB()

  switch (action) {
    case '-h':
      displayHelp()
      break

    case '-i':
      await dumpTweets()
      break

    default:
      await flagTweets(process.argv.slice(2, process.argv.length))
  }

  await killPool()
}

async function dumpTweets (): Promise<void> {
  const messages = await Message.findAll()

  console.log(messages.map((message) => message.get({ plain: true })))
}

async function flagTweets (ids: string[]): Promise<void> {
  const connection = await getConnection()

  const messages = await Message.findAll({
    where: {
      message_id: { [sequelize.Op.in]: ids }
    }
  })

  messages.forEach((message) => {
    message.update({ flagged: true })
  })

  await connection.query(`
    UPDATE message SET flagged=1 WHERE message_id IN (?);
  `, [ids.join(',')])

  await connection.end()
}

function displayHelp (): void {
  console.log(`
ITU-Minitwit Tweet Flagging Tool
  Usage:
    flag_tool <tweet_id>...
    flag_tool -i
    flag_tool -h
  Options:
    -h            Show this screen.
    -i            Dump all tweets and authors to STDOUT.
  `.trim())
}

flagTool()
  .catch((err) => { console.error(err) })
