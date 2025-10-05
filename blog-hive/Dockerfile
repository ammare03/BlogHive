# Build Next.js app (server mode)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install all dependencies (including dev) for build
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next telemetry in CI/Docker builds
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Run Next.js server
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
# Install only production dependencies fresh instead of copying
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
