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

# Build the application
RUN pnpm build

# ---- Runner ----
# Production image
FROM base AS runner
WORKDIR /app

ARG NEXT_PUBLIC_IA_API_URL
ENV NEXT_PUBLIC_IA_API_URL=$NEXT_PUBLIC_IA_API_URL
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL

# Copy the built application artifacts from the builder stage
COPY --from=builder /app/apps/content-acquisition/.next ./.next
COPY --from=builder /app/apps/content-acquisition/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/content-acquisition/package.json ./package.json
COPY --from=builder /app/apps/content-acquisition/ecosystem.config.js ./ecosystem.config.js

# Install pm2 and runtime dependencies
RUN npm install pm2 -g

# Create a simple start script that uses the correct next path
RUN echo '#!/bin/sh\nexec ./node_modules/.bin/next start --port 3000' > /usr/local/bin/start-next && \
    chmod +x /usr/local/bin/start-next

# Expose port
EXPOSE 3000

# Run application with pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]