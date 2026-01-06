# Gunakan Node.js versi 20 (LTS)
FROM node:20-alpine

# Set folder kerja
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code
COPY . .

# Build TypeScript (Pastikan script "build" ada di package.json)
RUN npm run build

# Expose port
EXPOSE 8000

# Jalankan server dari folder hasil build
CMD ["npm", "start"]