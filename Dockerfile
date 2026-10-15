FROM oven/bun:1.4.3-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock ./
RUN bun install --production --frozen-lockfile
COPY src ./src
USER bun
EXPOSE 3000
CMD ["bun", "src/index.ts"]
