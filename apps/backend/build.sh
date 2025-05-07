#!/bin/bash

# Clean the dist directory
rm -rf dist

# Install dependencies
npm install

# Build TypeScript
npx tsc

# Ensure the dist directory exists
mkdir -p dist

# Copy necessary files
cp package.json dist/
cp -r src/data dist/
cp .env dist/ 2>/dev/null || true

# Install production dependencies in dist
cd dist
npm install --production
cd ..

echo "Build completed successfully" 