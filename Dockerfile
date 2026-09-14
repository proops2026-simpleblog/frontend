# Sprint 1 (IRD-004): run the Vite dev server in the container.
# A production Nginx build is explicitly deferred to a later sprint.
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Run as a non-root user (node:20-alpine ships an unprivileged "node" user)
RUN chown -R node:node /app
USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
