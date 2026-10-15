# elysia-pg-bun-sql

Plain [Elysia](https://elysiajs.com) on Bun with `Bun.SQL` (Postgres). Implements the benchmark contract from `http-framework-benchmarks`.

```bash
bun install
docker compose up -d --wait   # Postgres, seeded from db/init-postgres.sql
bun run dev
```

Config comes from `.env` / environment (`PORT`, `DATABASE_*`). Checks: `bun run check`, `bun run typecheck`, `bun test`.
