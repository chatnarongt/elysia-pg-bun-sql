import { Elysia } from 'elysia'
import { bench } from './bench.ts'
import { ParseError } from './parse.ts'
import { probe } from './probe.ts'

const app = new Elysia()
  .onError({ as: 'global' }, ({ error, set }) => {
    if (error instanceof ParseError) {
      set.status = 400
      return error.message
    }
  })
  .use(probe)
  .use(bench)
  .listen({ port: Number(process.env.PORT ?? 3000), hostname: '0.0.0.0' })

process.on('SIGTERM', async () => {
  await app.stop()
  process.exit(0)
})
