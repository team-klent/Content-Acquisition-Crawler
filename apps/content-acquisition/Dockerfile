# ---- Base ----
# Use a base image to install pnpm, so it's cached and can be reused.
FROM node:18-alpine AS base

# Install build dependencies for native packages
RUN apk add --no-cache \
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

# Set the environment variables for the build
ENV NEXT_PUBLIC_URL=https://unifiedworkflow.innodata.com

# Copy package.json for dependency installation
COPY package.json ./

# Install dependencies (will use npm if no pnpm-lock.yaml exists)
RUN pnpm install

# Copy source code
COPY . ./

# Build the application
RUN pnpm build

# ---- Runner ----
FROM base AS runner

# Copy package.json for production dependencies
COPY package.json ./

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Install pm2 for process management
RUN npm install -g pm2

# Expose the port the app runs on
EXPOSE 3000

# The command to run the application
CMD ["pnpm", "start"]