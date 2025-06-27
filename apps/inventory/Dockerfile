FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

RUN pnpm install && pnpm --filter service-name build

CMD ["pnpm", "exec", "pm2-runtime", "start", "ecosystem.config.js", "--only", "service-name"]