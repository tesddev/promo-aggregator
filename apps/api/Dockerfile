FROM mcr.microsoft.com/playwright:v1.43.0-jammy

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies from root
RUN npm install

# Install playwright browsers
RUN npx playwright install chromium

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Run from the API directory
WORKDIR /app/apps/api
CMD ["npm", "run", "dev"]