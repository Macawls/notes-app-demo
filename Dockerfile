FROM oven/bun:1.1.38 as base

WORKDIR /app

# Install deps into temp - cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install dependencies without excluding devDependencies
# Since some dependencies might be needed for the build process
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# Copy node_modules from the temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules /app/node_modules
COPY . /app

# Build in production
ENV NODE_ENV=production
RUN bun --bun run build

# Copy into final image
FROM base AS release
WORKDIR /app
COPY --from=install /temp/prod/node_modules /app/node_modules
COPY --from=prerelease /app/.output /app/.output
COPY package.json /app/

USER bun
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "bun run /app/.output/server/index.mjs"]
