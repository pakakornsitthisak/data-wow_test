#!/bin/bash
# Script to start the frontend development server

# Navigate to the frontend directory using absolute path
cd /Users/pakakornsitthisak/workspace/data-wow_test/frontend

# Verify directory exists
if [ ! -d "$(pwd)" ]; then
    echo "Error: Directory does not exist!"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found!"
    exit 1
fi

# Start the development server
echo "Starting Next.js development server on port 3001..."
npm run dev
