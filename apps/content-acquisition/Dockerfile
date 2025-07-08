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

# Copy package.json for dependency installation
COPY package.json ./

# Install dependencies (will use npm if no pnpm-lock.yaml exists)
RUN pnpm install

# Copy source code
COPY . ./

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
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Install pm2
RUN npm install pm2 -g
COPY ecosystem.config.js .
COPY ./.env ./.env

# Expose port
EXPOSE 3000

# Run application with pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]