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
    echo -e "${RED}❌ Install Docker on: https://docs.docker.com/get-docker/${NC}"
    exit 1
}

# 2. Create .env if not exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️ .env already exists. You want overwriting it? (Y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env updated${NC}"
    else
        echo -e "${BLUE}ℹ️ Kept current .env${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✅ .env created${NC}"
fi

# 3. Generate random JWT_SECRET
if command -v openssl >/dev/null 2>&1; then
    JWT_SECRET=$(openssl rand -hex 32)
elif command -v node >/dev/null 2>&1; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
else
    JWT_SECRET="change_this_to_a_random_string_in_production"
    echo -e "${YELLOW}⚠️  OpenSSL and Node.js not find. Using default JWT_SECRET.${NC}"
fi

# Add JWT_SECRET to .env if not exists
if ! grep -q "^JWT_SECRET=" .env; then
    echo "JWT_SECRET=$JWT_SECRET" >> .env
    echo -e "${GREEN}✅ Added JWT_SECRET to .env${NC}"
else
    echo -e "${BLUE}ℹ️  JWT_SECRET already exists on .env${NC}"
fi

# 4. Setup Git hooks
echo -e "${BLUE}⚙️  Setting up Git hooks...${NC}"
git config core.hooksPath backend/.husky
chmod +x backend/.husky/pre-commit 2>/dev/null || true
echo -e "${GREEN}✅ Git hooks configured (backend/.husky)${NC}"

# 5. Estructure folders
mkdir -p backend/src/database/{migrations,seeds}
mkdir -p frontend/src

# 6. Verify available ports
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -an | grep ":$port " >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Porta $port ($service) already on use${NC}"
        echo -e "${YELLOW} You can change the port on .env${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $port ($service) is available${NC}"
        return 0
    fi
}

check_port 3000 "Backend"
check_port 5173 "Frontend"
check_port 5432 "PostgreSQL"

# 7. Start containers
if docker compose up -d --build; then
    echo -e "${GREEN}✅ Started containers!${NC}"
else
    echo -e "${RED}❌ Error to start containers${NC}"
    exit 1
fi

echo -e "${YELLOW}Awaiting services starts...${NC}"
sleep 5

# Verify postgres
if docker compose ps postgres | grep -q "healthy"; then
    echo -e "${GREEN}✅ postgres ready${NC}"
else
    echo -e "${YELLOW}⏳ postgres starting...${NC}"
fi

# Run Migrate
if docker compose exec -T pms-api npm run migrate:latest; then
    echo -e '${GREEN} Migrations completed successfully${NC}'
else
    echo -e '${RED} Error running migrations${NC}'
    echo -e '${YELLOW}⚠️  Check the logs with: docker compose logs pms-api${NC}'
fi

echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════╗"
echo "║ Setup Finish With Sucess! ║"
echo "╚═══════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📍 Access URLs:${NC}"
echo "   • Frontend:  http://localhost:5173"
echo "   • Backend:   http://localhost:3000"
echo "   • PostgreSQL: localhost:5432"
echo ""

echo -e "${BLUE}📚 Documentação:${NC}"
echo "   • README.md - Documentação completa"
echo "   • GUIA-ENV.md - Variáveis de ambiente"
echo "   • Makefile - Comandos make disponíveis"
echo ""

echo -e "${YELLOW}⚠️  NEVER commit the .env file!${NC}"