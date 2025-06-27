FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

RUN npm install -g pm2

RUN pnpm install && pnpm --filter content-acquisition build

CMD ["pnpm", "exec", "pm2-runtime", "start", "ecosystem.config.js", "--only", "content-acquisition"]