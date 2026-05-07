FROM mcr.microsoft.com/playwright:v1.43.0-jammy
WORKDIR /app
COPY package.json ./
RUN npm install
RUN npx playwright install chromium
COPY . .
CMD ["npm", "run", "dev"]