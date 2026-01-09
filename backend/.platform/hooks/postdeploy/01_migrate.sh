#!/bin/bash
set -e

echo "Running database migrations..."
cd /var/app/current

export NODE_ENV=production

npm run migrate:production

echo "Migrations completed successfully"
