FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY . .

ARG BASE_PATH
ENV BASE_PATH=${BASE_PATH}

RUN npm install -g pm2

RUN pnpm install && pnpm --filter qualification build

CMD ["pnpm", "exec", "pm2-runtime", "start", "ecosystem.config.js", "--only", "qualification", "--env", "production"]