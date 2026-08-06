# Build stage. Dev dependencies are needed to compile, but none of them ship.
FROM node:22-alpine AS build

WORKDIR /app

# Copy manifests first so `npm ci` is only re-run when dependencies change,
# not on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# PUBLIC_* values are inlined at build time by Vite, so the canonical origin and
# analytics ID have to be present now rather than at container start.
ARG PUBLIC_SITE_URL=https://lytebuy.com
ARG PUBLIC_GA_ID=
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV PUBLIC_GA_ID=$PUBLIC_GA_ID

RUN npm run build

# Drop dev dependencies before they are copied into the runtime image.
RUN npm prune --omit=dev


# Runtime stage.
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Run unprivileged. The node image already ships a `node` user.
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node

EXPOSE 3000

# BLOG_API_URL and BLOG_API_KEY are read at request time by
# src/lib/server/blog.ts, so they are injected as container env, not build args.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "build"]
