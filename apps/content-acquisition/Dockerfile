# ---- Base ----
    FROM node:18-alpine AS base

    ARG NEXT_PUBLIC_URL
    ARG NEXT_PUBLIC_IA_API_URL
    
    # Install system dependencies
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
    
    # Install pnpm and pm2 globally
    RUN npm install -g pnpm@9.12.0 pm2
    
    WORKDIR /app
    
    # ---- Deps ----
    FROM base AS deps
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY apps ./apps
    COPY packages ./packages
    
    RUN pnpm install --frozen-lockfile
    
    # ---- Builder ----
    FROM deps AS builder
    
    WORKDIR /app/apps/content-acquisition
    
    ARG NEXT_PUBLIC_IA_API_URL
    ARG NEXT_PUBLIC_URL
    ENV NEXT_PUBLIC_IA_API_URL=$NEXT_PUBLIC_IA_API_URL
    ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
    
    RUN pnpm build
    
    # ---- Runner ----
    FROM base AS runner
    
    WORKDIR /app
    
    ARG NEXT_PUBLIC_IA_API_URL
    ENV NEXT_PUBLIC_IA_API_URL=$NEXT_PUBLIC_IA_API_URL
    ARG NEXT_PUBLIC_URL
    ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
    
    # Copy artifacts
    COPY --from=builder /app/apps/content-acquisition/.next ./.next
    COPY --from=builder /app/apps/content-acquisition/public ./public
    COPY --from=builder /app/apps/content-acquisition/package.json ./package.json
    COPY --from=builder /app/apps/content-acquisition/ecosystem.config.js ./ecosystem.config.js
    
    # Copy node_modules
    COPY --from=deps /app/node_modules ./node_modules
    
    # Copy .pnpm (important for runtime dependencies!)
    COPY --from=deps /app/.pnpm ./node_modules/.pnpm
    COPY --from=deps /app/.npmrc ./.npmrc
    
    # Ensure correct PM2 script
    RUN echo '#!/bin/sh\nexec pnpm start' > /usr/local/bin/start-next \
        && chmod +x /usr/local/bin/start-next
    
    EXPOSE 3000
    
    CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
    