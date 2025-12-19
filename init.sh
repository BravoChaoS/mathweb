#!/bin/bash

# Mathweb Initialization Script

echo "Initializing Mathweb Development Environment..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js (v18+ recommended)."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    exit 1
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "Warning: package.json not found. Skipping npm install."
    echo "Please run this script after generating the project structure."
fi

echo "------------------------------------------------"
echo "Setup Complete!"
echo "To start the development server, run:"
echo "  npm run dev"
echo "------------------------------------------------"
