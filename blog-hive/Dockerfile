# Stage 1: Build the Next.js application
FROM node:20-alpine AS build
WORKDIR /app

# --- npm ---
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile
# --- End npm ---

# Copy the rest of the application code
COPY . .

# Set NEXT_PUBLIC_API_URL build argument
# Default value can be overridden during docker build
ARG NEXT_PUBLIC_API_URL=http://localhost:8081
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js application
# Use the build script defined in your package.json
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Stage 2: Create the final production image
FROM node:20-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the build stage
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set user to the non-root user
USER nextjs

# Expose the port Next.js runs on (default 3000)
EXPOSE 3000

# Set the HOSTNAME environment variable for Next.js server
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

# Command to run the Next.js application in production mode
# This uses the Node.js server built into Next.js standalone output
CMD ["node", "server.js"]