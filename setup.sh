#!/bin/bash

# Script to setup the project

set -e  # Stop if has an error

# Colors to output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verify pré requirements
command -v docker >/dev/null 2>&1 || {
    echo -e "${RED}ERROR: Install Docker on: https://docs.docker.com/get-docker/${NC}"
    exit 1
}

# 2. Create .env if not exists
if [ -f .env ]; then
    echo -e "${YELLOW}WARNING: .env already exists. You want overwriting it? (Y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cp .env.example .env
        echo -e "${GREEN}OK: .env updated${NC}"
    else
        echo -e "${BLUE}INFO: Kept current .env${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}OK: .env created${NC}"
fi

# 3. Generate random JWT_SECRET
if command -v openssl >/dev/null 2>&1; then
    JWT_SECRET=$(openssl rand -hex 32)
elif command -v node >/dev/null 2>&1; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
else
    JWT_SECRET="change_this_to_a_random_string_in_production"
    echo -e "${YELLOW}WARNING:  OpenSSL and Node.js not find. Using default JWT_SECRET.${NC}"
fi

# Add JWT_SECRET to .env if not exists
if ! grep -q "^JWT_SECRET=" .env; then
    echo "JWT_SECRET=$JWT_SECRET" >> .env
    echo -e "${GREEN}OK: Added JWT_SECRET to .env${NC}"
else
    echo -e "${BLUE}INFO:  JWT_SECRET already exists on .env${NC}"
fi

# 4. Setup Git hooks
echo -e "${BLUE}INFO:  Setting up Git hooks...${NC}"
git config core.hooksPath backend/.husky
chmod +x backend/.husky/pre-commit 2>/dev/null || true
echo -e "${GREEN}OK: Git hooks configured (backend/.husky)${NC}"

# 5. Estructure folders
mkdir -p backend/src/database/{migrations,seeds}
mkdir -p frontend/src

# 6. Verify available ports
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -an | grep ":$port " >/dev/null 2>&1; then
        echo -e "${YELLOW}WARNING:  Porta $port ($service) already on use${NC}"
        echo -e "${YELLOW} You can change the port on .env${NC}"
        return 1
    else
        echo -e "${GREEN}OK: Port $port ($service) is available${NC}"
        return 0
    fi
}

check_port 3000 "Backend"
check_port 5173 "Frontend"
check_port 5432 "PostgreSQL"
check_port 5433 "PostgreSQL Test"

# 7. Start containers
if docker compose up -d --build; then
    echo -e "${GREEN}OK: Started containers!${NC}"
else
    echo -e "${RED}ERROR: Error to start containers${NC}"
    exit 1
fi

echo -e "${YELLOW}Awaiting services starts...${NC}"
sleep 5

# 8. Verify postgres services
if docker compose ps conf-postgres | grep -q "healthy"; then
    echo -e "${GREEN}OK: Development database ready${NC}"
else
    echo -e "${YELLOW}WAIT: Development database starting...${NC}"
    sleep 3
fi

if docker compose ps conf-postgres-test | grep -q "healthy"; then
    echo -e "${GREEN}OK: Test database ready${NC}"
else
    echo -e "${YELLOW}WAIT: Test database starting...${NC}"
    sleep 3
fi

# 9. Run migrations on test database
echo -e "${BLUE}INFO:  Running migrations on test database...${NC}"
cd backend
if NODE_ENV=test npm run migrate:latest 2>/dev/null; then
    echo -e "${GREEN}OK: Test database migrations completed${NC}"
else
    echo -e "${YELLOW}WARNING:  Could not run migrations on test database (run 'npm run db:test:setup' later)${NC}"
fi
cd ..

echo -e "${BLUE}ACCESS: Access URLs:${NC}"
echo "   • Frontend:       http://localhost:5173"
echo "   • Backend:        http://localhost:3000"
echo "   • PostgreSQL:     localhost:5432"
echo "   • PostgreSQL Test: localhost:5433"
echo ""

echo -e "${BLUE}DOCS: Documentation:${NC}"
echo "   • README.md - Full Documentation"
echo "   • Makefile - Make commands available"