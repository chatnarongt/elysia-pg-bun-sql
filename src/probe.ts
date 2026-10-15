import { Elysia } from 'elysia'

export const probe = new Elysia({ prefix: '/probe' })
  .get('/liveness', () => 'OK')
  .get('/readiness', () => 'OK')
