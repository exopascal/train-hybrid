# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG YARN_VERSION=1.22.22

########################
# Base image
FROM node:${NODE_VERSION} AS base
WORKDIR /app

########################
# Builder stage
FROM base AS builder
ENV YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn
ENV NITRO_PRESET=node-server
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate
WORKDIR /app

# Copy only package.json and yarn.lock for dependency install (use --link for build cache efficiency)
COPY --link package.json yarn.lock ./

# Install dependencies with cache
RUN --mount=type=cache,target=${YARN_CACHE_FOLDER} \
    yarn install

# Copy the rest of the application source (excluding files via .dockerignore)
COPY --link . .

# Build the application (Nuxt/TypeScript)
RUN yarn build

########################
# Production image
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy only necessary files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment variables for production
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV NODE_TLS_REJECT_UNAUTHORIZED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 3000

# Start the Nuxt app (Nuxt 3 output dir is .output, entrypoint is .output/server/index.mjs)
CMD ["node", ".output/server/index.mjs"]
