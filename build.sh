#!/bin/bash

# Build shared package first
cd packages/shared
npm install
npx tsup
cd ../..

# Build backend
cd apps/backend
npm install
npx tsc
cd ../..

echo "Build completed successfully" 