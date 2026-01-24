#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting deployment process..."

# 1. Run the build
echo "📦 Building applications..."
pnpm build

# 2. Run the deployment
echo "☁️ Deploying with Pulumi..."
pulumi up -C pulumi -y --stack dimitri-luphy/captech-dealflow

echo "✅ Deployment completed successfully!"
