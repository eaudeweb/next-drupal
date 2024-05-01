#!/bin/bash

echo "Starting cleanup..."

# Find and remove node_modules directories, next and turbo cache files
find . \( -name "node_modules" -type d -prune -o -name ".next" -type d -prune -o -name ".turbo" -type d -prune \) -exec rm -rf '{}' +

echo "node_modules directories, next and turbo cache files removed."

echo "Installing dependencies with pnpm..."
# Reinstall dependencies
pnpm i

echo "Dependencies installed."
