# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install 


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV for build
ENV NEXT_TELEMETRY_DISABLED=1
ARG MONGO_CONNECTION_STRING
ENV MONGO_CONNECTION_STRING=$MONGO_CONNECTION_STRING
ARG MONGO_DATABASE_NAME
ENV MONGO_DATABASE_NAME=$MONGO_DATABASE_NAME
ARG YANDEX_TOKEN
ENV YANDEX_TOKEN=$YANDEX_TOKEN
ARG FOLDER_PATH
ENV FOLDER_PATH=$FOLDER_PATH
ARG TELEGRAM_BOT_NAME
ENV TELEGRAM_BOT_NAME=$TELEGRAM_BOT_NAME
ARG TELEGRAM_BOT_TOKEN
ENV TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
ARG TELEGRAM_BOT_CHAT
ENV TELEGRAM_BOT_CHAT=$TELEGRAM_BOT_CHAT


RUN yarn run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# ENV for runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]