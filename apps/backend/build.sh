#!/bin/bash

# Clean the dist directory
rm -rf dist

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Ensure the dist directory exists
mkdir -p dist

# Copy necessary files
cp package.json dist/
cp -r prisma dist/
cp .env dist/ 2>/dev/null || true

# Install production dependencies in dist
cd dist
npm install --production
cd ..

echo "Build completed successfully" 