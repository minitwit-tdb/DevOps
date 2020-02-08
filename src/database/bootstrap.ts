import { getConnection } from './getConnection'

export async function bootstrapDB (): Promise<void> {
  const userPromise = (await getConnection()).query(`
    create table if not exists user (
      user_id int auto_increment,
      username varchar(255) not null,
      email varchar(255) not null,
      pw_hash varchar(255) not null,
      PRIMARY KEY(user_id)
    );
  `)

  const followerPromise = (await getConnection()).query(`
    create table if not exists follower (
      who_id int,
      whom_id int
    ); 
  `)

  const messagePromise = (await getConnection()).query(`
    create table if not exists message (
      message_id int auto_increment,
      author_id int not null,
      text text not null,
      pub_date int,
      flagged int,
      PRIMARY KEY(message_id)
    ); 
  `)

  await Promise.all([userPromise, followerPromise, messagePromise])
}
