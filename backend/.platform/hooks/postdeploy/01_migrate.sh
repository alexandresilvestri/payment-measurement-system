#!/bin/bash
set -e

echo "Running database migrations..."
cd /var/app/current

export NODE_ENV=production

npm run migrate:production

echo "Migrations completed successfully"

echo "Running database seeds..."
npm run seed:run:production

echo "Seeds completed successfully"
