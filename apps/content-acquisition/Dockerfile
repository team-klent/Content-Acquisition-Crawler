# ---- Base ----
# Use a base image to install pnpm, so it's cached and can be reused.
FROM node:18-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app


# ---- Builder ----
# Build the application and all its dependencies.
FROM base AS builder
# First, copy only the files needed for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/content-acquisition/package.json ./apps/content-acquisition/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/

# Install all dependencies (including devDependencies for the build)
RUN pnpm install

COPY . .

RUN pnpm --filter content-acquisition build

FROM base AS runner

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/content-acquisition/package.json ./apps/content-acquisition/

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application artifacts from the builder stage
COPY --from=builder /app/apps/content-acquisition/.next ./apps/content-acquisition/.next
COPY --from=builder /app/apps/content-acquisition/public ./apps/content-acquisition/public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ecosystem.config.js ./

# Set the BASE_PATH environment variable
ARG BASE_PATH
ENV BASE_PATH=${BASE_PATH}

# Install pm2 for process management
RUN npm install -g pm2

# Expose the port the app runs on
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "exec", "pm2-runtime", "start", "ecosystem.config.js", "--only", "content-acquisition", "--env", "production"]