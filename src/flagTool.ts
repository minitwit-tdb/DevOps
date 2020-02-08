import { getConnection, killPool } from './database'

async function flagTool (): Promise<void> {
  const action = process.argv[2]

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
  const connection = await getConnection()

  const res = await connection.query(`
    SELECT * FROM message;
  `)
  delete res.meta

  console.log(res)

  await connection.end()
}

async function flagTweets (ids: string[]): Promise<void> {
  const connection = await getConnection()

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
