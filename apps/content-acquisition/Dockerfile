# ---- Base ----
# Use a base image to install pnpm, so it's cached and can be reused.
FROM node:18-alpine AS base

ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_IA_API_URL

# Install build dependencies for native packages
RUN apk add --no-cache \
    build-base \
    pkgconf \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

RUN npm install -g pnpm@9.12.0
WORKDIR /app

# ---- Builder ----
# Build the application and all its dependencies.
FROM base AS builder

# Copy workspace files for pnpm workspace support
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared packages if they exist
COPY packages/ ./packages/

# Copy the app's package.json first
COPY apps/content-acquisition/package.json ./apps/content-acquisition/package.json

# Install dependencies using workspace
RUN pnpm install

# Copy application source
COPY apps/content-acquisition/ ./apps/content-acquisition/

# Set working directory to the app for build
WORKDIR /app/apps/content-acquisition

# Set build-time environment variables (these will be baked into the build)
ARG NEXT_PUBLIC_IA_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_IA_API_URL=$NEXT_PUBLIC_IA_API_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL

# Build the application using npx to locate next binary
RUN npx next build

# ---- Runner ----
# Production image
FROM base AS runner
WORKDIR /app

ARG NEXT_PUBLIC_IA_API_URL
ENV NEXT_PUBLIC_IA_API_URL=$NEXT_PUBLIC_IA_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL

# Copy workspace files for proper module resolution
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy shared packages to maintain workspace structure
COPY --from=builder /app/packages ./packages

# Copy the entire node_modules with proper structure
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application with proper directory structure
COPY --from=builder /app/apps/content-acquisition/.next ./apps/content-acquisition/.next
COPY --from=builder /app/apps/content-acquisition/public ./apps/content-acquisition/public
COPY --from=builder /app/apps/content-acquisition/package.json ./apps/content-acquisition/package.json
COPY --from=builder /app/apps/content-acquisition/ecosystem.config.js ./apps/content-acquisition/ecosystem.config.js
COPY --from=builder /app/apps/content-acquisition/next.config.ts ./apps/content-acquisition/next.config.ts

# Set working directory to the app
WORKDIR /app/apps/content-acquisition

# Install pm2 globally
RUN npm install pm2 -g

# Expose port
EXPOSE 3000

# Use Next.js start command directly from the workspace
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]