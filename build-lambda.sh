#!/bin/bash

echo "Building Lambda deployment package..."

# Navigate to backend directory
cd src/backend

# Install dependencies
echo "Installing dependencies..."
npm install

# Create deployment directory
rm -rf lambda-build
mkdir lambda-build

# Copy backend files
echo "Copying backend files..."
cp *.js lambda-build/
cp package.json lambda-build/
cp -r node_modules lambda-build/

# Copy utils if needed for backend
if [ -d "../utils" ]; then
    echo "Copying shared utils..."
    cp -r ../utils lambda-build/
fi

# Copy environment file if exists
if [ -f ".env" ]; then
    cp .env lambda-build/
fi

# Create zip package
echo "Creating deployment package..."
cd lambda-build
zip -r ../lambda-deployment.zip . -x "*.DS_Store*" "*.git*"
cd ..

# Clean up
rm -rf lambda-build

echo "Lambda deployment package created: lambda-deployment.zip"
echo "Package is ready for upload to AWS Lambda!"
