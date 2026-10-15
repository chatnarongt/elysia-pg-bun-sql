import { SQL } from 'bun'
import { Elysia } from 'elysia'

const sql = new SQL({
  adapter: 'postgres',
  hostname: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: Number(process.env.DATABASE_MAX_POOL_SIZE),
})

export const db = new Elysia({ name: 'db' }).decorate('sql', sql).onStop(() => sql.close())
