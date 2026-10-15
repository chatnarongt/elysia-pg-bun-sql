import { Elysia, NotFoundError } from 'elysia'
import { db } from './db.ts'
import { int, ints, param, pgIntArray, records } from './parse.ts'

export const bench = new Elysia({ prefix: '/bench' })
  .use(db)
  .get('/plaintext', () => 'Hello, World!')
  .get('/json', () => ({ message: 'Hello, World!' }))
  .get('/read-one', async ({ sql, request }) => {
    const [row] = await sql`
      SELECT id, random_number AS "randomNumber" FROM world
      WHERE id = ${int(param(request.url, 'id'), 'id')}`
    if (!row) throw new NotFoundError()
    return row
  })
  .get('/read-many', ({ sql, request }) => {
    const limit = param(request.url, 'limit')
    const afterId = param(request.url, 'afterId')
    const n = limit === undefined ? 20 : int(limit, 'limit')
    return sql`
      SELECT id, random_number AS "randomNumber" FROM world
      WHERE id > ${afterId === undefined ? 0 : int(afterId, 'afterId')}
      ORDER BY id LIMIT ${Math.min(Math.max(n, 1), 100)}`
  })
  .get('/create-one', async ({ sql, request }) => {
    const [row] = await sql`
      INSERT INTO world (random_number)
      VALUES (${int(param(request.url, 'randomNumber'), 'randomNumber')})
      RETURNING id, random_number AS "randomNumber"`
    return row
  })
  .get('/create-many', ({ sql, request }) => {
    return sql`
      INSERT INTO world (random_number)
      SELECT unnest(${pgIntArray(ints(param(request.url, 'randomNumber'), 'randomNumber'))}::int[])
      RETURNING id, random_number AS "randomNumber"`
  })
  .get('/update-one', async ({ sql, request }) => {
    const [r] = records(param(request.url, 'record'))
    const [row] = await sql`
      UPDATE world SET random_number = ${r.randomNumber} WHERE id = ${r.id}
      RETURNING id, random_number AS "randomNumber"`
    if (!row) throw new NotFoundError()
    return row
  })
  .get('/update-many', ({ sql, request }) => {
    const rs = records(param(request.url, 'record'))
    return sql`
      UPDATE world w SET random_number = v.r
      FROM unnest(${pgIntArray(rs.map((r) => r.id))}::int[],
                  ${pgIntArray(rs.map((r) => r.randomNumber))}::int[]) AS v(id, r)
      WHERE w.id = v.id
      RETURNING w.id, w.random_number AS "randomNumber"`
  })
  .get('/delete-one', async ({ sql, request }) => {
    await sql`DELETE FROM world WHERE id = ${int(param(request.url, 'id'), 'id')}`
  })
  .get('/delete-many', async ({ sql, request }) => {
    await sql`DELETE FROM world WHERE id = ANY(${pgIntArray(ints(param(request.url, 'id'), 'id'))}::int[])`
  })
