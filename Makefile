# =============================================================================
# Payment Measurement System - Makefile
# =============================================================================
# This file contains shortcuts for common development tasks
# Usage: make <target>
# Example: make dev
# =============================================================================

# .PHONY tells make these aren't actual files, just command names
.PHONY: help dev up down restart logs ps clean install test test-single lint format migrate-make migrate-latest migrate-rollback migrate-status seed-make seed-run db-shell-test logs-db-test update

# Default target - runs when you just type 'make'
.DEFAULT_GOAL := help

help:
	@echo "Setup & Installation:"
	@echo "  make install           Install all dependencies"
	@echo "  make install-backend   Install backend dependencies"
	@echo "  make install-frontend  Install frontend dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev              Start all services"
	@echo "  make up               Start all services (alias)"
	@echo "  make down             Stop all services"
	@echo "  make restart          Restart all services"
	@echo "  make build            Rebuild all containers"
	@echo "  make update           Rebuild containers with fresh dependencies (run after git pull)"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs             View logs from all services"
	@echo "  make logs-backend     View backend logs"
	@echo "  make logs-frontend    View frontend logs"
	@echo "  make logs-db          View database logs"
	@echo "  make logs-db-test     View test database logs"
	@echo "  make ps               Show running containers"
	@echo ""
	@echo "Testing:"
	@echo "  make test             Run all tests"
	@echo "  make test-backend     Run backend tests"
	@echo "  make test-single      Run a single test file (use: file=path/to/test.ts)"
	@echo "  make test-watch       Run tests in watch mode"
	@echo "  make test-coverage    Run tests with coverage"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint             Run ESLint on all code"
	@echo "  make lint-fix         Run ESLint and auto-fix issues"
	@echo "  make format           Format code with Prettier"
	@echo "  make format-check     Check code formatting"
	@echo "  make pre-commit       Run all checks before commit"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell         Open PostgreSQL shell (dev DB)"
	@echo "  make db-shell-test    Open PostgreSQL shell (test DB)"
	@echo "  make db-reset         Reset database (WARNING: deletes all data!)"
	@echo "  make migrate-latest   Run pending migrations"
	@echo "  make migrate-rollback Rollback last migration"
	@echo "  make migrate-status   Check migration status"
	@echo "  make migrate-make     Create new migration (use: name=migration_name)"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            Stop and remove containers"
	@echo "  make clean-all        Clean everything including images"
	@echo ""

# Start all services in detached mode
dev: up

up:
	@echo "Starting all services..."
	docker compose up -d
	@echo "Services started!"
	@echo ""
	@echo "Access your application:"
	@echo "   Frontend:      http://localhost:5173"
	@echo "   Backend:       http://localhost:3000"
	@echo "   Database:      localhost:5432"
	@echo "   Test Database: localhost:5433"
	@echo ""
	@echo "Use 'make logs' to view logs"

# Stop all services
down:
	@echo "Stopping all services..."
	docker compose down
	@echo "Services stopped!"

# Restart all services
restart:
	@echo "Restarting all services..."
	docker compose restart
	@echo "Services restarted!"

# Rebuild and start all containers
build:
	@echo "Building all containers..."
	docker compose up -d --build
	@echo "Containers built and started!"

# Update containers with fresh dependencies (use after git pull or when dependencies change)
update:
	@echo "Updating containers with fresh dependencies..."
	@echo "Step 1/2: Rebuilding containers..."
	docker compose build
	@echo "Step 2/2: Recreating containers with fresh volumes..."
	docker compose up -d --force-recreate --renew-anon-volumes
	@echo "Update complete! Fresh dependencies installed."
	@echo "Tip: Run 'make test' to verify everything works."

# MONITORING COMMANDS

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f conf-postgres

logs-db-test:
	docker compose logs -f conf-postgres-test

ps:
	docker compose ps

# INSTALLATION COMMANDS

install: install-backend install-frontend
	@echo ""
	@echo "All dependencies installed!"

install-backend:
	@echo "Installing backend dependencies..."
	docker compose exec conf-api npm install
	@echo "Backend dependencies installed!"

install-frontend:
	@echo "Installing frontend dependencies..."
	docker compose exec conf-client npm install
	@echo "Frontend dependencies installed!"

# TESTING COMMANDS

test: test-backend
	@echo "All tests completed!"

test-backend:
	@echo "Running backend tests..."
	docker compose exec -e DB_TEST_HOST=conf-postgres-test conf-api npm test

test-single:
	@if [ -z "$(file)" ]; then \
		echo "Error: Test file is required"; \
		echo "Usage: make test-single file=src/services/__tests__/Contracts.test.ts"; \
		exit 1; \
	fi
	@echo "Running test: $(file)..."
	docker compose exec -e DB_TEST_HOST=conf-postgres-test conf-api npm test $(file)

test-watch:
	@echo "Running tests in watch mode..."
	@echo "Press Ctrl+C to stop"
	docker compose exec conf-api npm run test:watch

test-coverage:
	@echo "Running tests with coverage..."
	docker compose exec conf-api npm run test:coverage
	@echo ""
	@echo "Coverage report generated in backend/coverage/"

# DATABASE COMMANDS

db-shell:
	@echo "Opening PostgreSQL shell (development)..."
	@echo "Type '\q' to exit"
	docker compose exec conf-postgres psql -U postgres -d conf

db-shell-test:
	@echo "Opening PostgreSQL shell (test)..."
	@echo "Type '\q' to exit"
	docker compose exec conf-postgres-test psql -U postgres -d conf_test

# Reset database (WARNING: deletes all data!)
db-reset:
	@echo "WARNING: This will delete ALL data in both dev and test databases!"
	@echo -n "Are you sure? Type 'yes' to continue: " && read answer && [ "$$answer" = "yes" ]
	@echo "Resetting databases..."
	docker compose down -v
	docker compose up -d conf-postgres conf-postgres-test
	@sleep 5
	docker compose up -d
	@echo "Migrations will run automatically on startup..."
	@echo "Databases reset complete!"

# CLEANUP COMMANDS

clean:
	@echo "Cleaning up containers and volumes..."
	docker compose down -v
	@echo "Cleanup complete!"

clean-all: clean
	@echo "Removing Docker images..."
	docker compose down -v --rmi all
	@echo "Full cleanup complete!"

# UTILITY COMMANDS

shell-backend:
	@echo "Opening backend shell..."
	docker compose exec conf-api sh

shell-frontend:
	@echo "Opening frontend shell..."
	docker compose exec conf-client sh

# CODE QUALITY COMMANDS

lint:
	@echo "Running ESLint on all code..."
	@echo "Backend:"
	@docker compose exec -T conf-api npm run lint
	@echo ""
	@echo "Frontend:"
	@docker compose exec -T conf-client npm run lint
	@echo "Linting complete!"

lint-fix:
	@echo "Running ESLint with auto-fix..."
	@echo "Backend:"
	@docker compose exec conf-api npm run lint:fix
	@echo ""
	@echo "Frontend:"
	@docker compose exec conf-client npm run lint:fix
	@echo "Auto-fix complete!"

format:
	@echo "Formatting code with Prettier..."
	@echo "Backend:"
	@docker compose exec -T conf-api npm run format
	@echo ""
	@echo "Frontend:"
	@docker compose exec -T conf-client npm run format
	@echo "Formatting complete!"

format-check:
	@echo "Checking code formatting..."
	@echo "Backend:"
	@docker compose exec conf-api npm run format:check
	@echo ""
	@echo "Frontend:"
	@docker compose exec conf-client npm run format:check
	@echo "Format check complete!"

pre-commit: format-check lint
	@echo ""
	@echo "All pre-commit checks passed!"
	@echo "Ready to commit!"

lint-backend:
	@echo "Linting backend code..."
	docker compose exec conf-api npm run lint

health:
	@echo "Checking service health..."
	@echo -n "Backend:  "
	@curl -s http://localhost:3000/health > /dev/null && echo "Running" || echo "Not responding"
	@echo -n "Frontend: "
	@curl -s http://localhost:5173 > /dev/null && echo "Running" || echo "Not responding"
	@echo -n "Database: "
	@docker compose exec postgres pg_isready -U postgres > /dev/null 2>&1 && echo "Running" || echo "Not responding"

# MIGRATION COMMANDS

migrate-make:
	@if [ -z "$(name)" ]; then \
		echo "Error: Migration name is required"; \
		echo "Usage: make migrate-make name=create_users_table"; \
		exit 1; \
	fi
	@echo "Creating migration: $(name)..."
	@docker compose exec conf-api npm run migrate:make $(name)
	@docker compose exec conf-api chown -R node:node /app/src/database/migrations
	@echo "Migration created!"

migrate-latest:
	@echo "Running migrations..."
	@docker compose exec conf-api npm run migrate:latest
	@echo "Migrations complete!"

migrate-rollback:
	@echo "Rolling back last migration..."
	@docker compose exec conf-api npm run migrate:rollback
	@echo "Rollback complete!"

migrate-status:
	@echo "Migration status:"
	@docker compose exec conf-api npm run migrate:status

seed-make:
	@if [ -z "$(name)" ]; then \
		echo "Error: Seed name is required"; \
		echo "Usage: make seed-make name=initial_users"; \
		exit 1; \
	fi
	@echo "Creating seed: $(name)..."
	@docker compose exec conf-api npm run seed:make $(name)
	@echo "Fixing file permissions..."
	@docker compose exec conf-api chown -R node:node /app/src/database/seeds
	@echo "Seed created!"

seed-run:
	@echo "Running seeds..."
	@docker compose exec conf-api npm run seed:run
	@echo "Seeds complete!"
