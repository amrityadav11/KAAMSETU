#!/bin/bash
# Render build script for backend

set -e  # Exit on error

echo "📦 Installing server dependencies..."
npm install --prefix server

echo "✅ Build complete!"
