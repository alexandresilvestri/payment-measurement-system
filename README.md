# ERP Conferir Engenharia

A full-stack ERP web application for managing construction project contracts, measurements, suppliers, and payment tracking.

## Overview

Payment Measurement System is an ERP solution designed for construction companies to:
- Create and manage contracts for construction projects in progress
- Create and track measurements for contract work
- Handle role-based access

## Technology Stack

### Backend
- **Language:** TypeScript 5.3
- **Runtime:** Node.js 20
- **Framework:** Express.js 4.18
- **Database:** PostgreSQL 16
- **Query Builder:** Knex.js 3.1
- **Authentication:** JWT (jsonwebtoken, jose)
- **Validation:** Zod 4.2
- **Testing:** Vitest 4.0 with coverage support

### Frontend
- **Language:** TypeScript 5.2
- **Library:** React 18.2
- **Build Tool:** Vite 7.2
- **Styling:** Tailwind CSS 3.4

### Infrastructure
- **Containerization:** Docker with multi-stage builds
- **Orchestration:** Docker Compose (API, Client, PostgreSQL dev/test)
- **Development:** Hot-reload enabled for rapid development
- **Deployment:** AWS RDS, AWS Elastic Beanstalk, AWS Amplify

## Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Secure password hashing using Argon2
- Role-based access control via user types
- Protected API routes with authentication middleware

### User Management
- User accounts with email and password
- User types/roles with customizable permissions
- Permission control (e.g., `approveMeasurement`)

### Works (Construction Projects)
- Create and manage construction projects
- Track project information: name, address, contractor
- Auto-generated numeric work codes (100-999 range)
- Status tracking: ATIVA (Active) or CONCLUIDA (Completed)
- Unique work names

### Supplier Management
- Manage suppliers (Pessoa Física/Jurídica)
- Track CPF/CNPJ documentation
- PIX account information
- Quick supplier creation via modal dialog

### Contract Management
- Link construction projects with suppliers
- Create itemized service contracts with:
  - Multiple contract items per contract
  - Description, unit measure, quantity, unit labor value
  - Automatic total value calculation
- Start date and optional delivery time tracking
- Status management: Ativo (Active) or Encerrado (Closed)
- Filter contracts by work or supplier

### Measurement System
- Create measurements from active contracts
- Track work progress by contract items
- Accumulate measurements against contract quantities
- Comprehensive status workflow:
  - **RASCUNHO** (Draft) - Initial creation
  - **PENDENTE** (Pending) - Awaiting director review
  - **APROVADA** (Approved) - Director approved, sent to finance
  - **REPROVADA** (Rejected) - Director rejected with observations
- Director approval/rejection with observations
- Total value calculation
- Historical view of realized (approved) measurements

## Project Structure

```
conferir/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── controllers/        # HTTP request handlers
│   │   │   ├── auth.ts         # Login, refresh, logout
│   │   │   ├── users.ts        # User management
│   │   │   ├── userTypes.ts    # Role management
│   │   │   ├── works.ts        # Construction projects
│   │   │   ├── suppliers.ts    # Supplier management
│   │   │   └── contracts.ts    # Contract operations
│   │   ├── services/           # Business logic layer
│   │   ├── repository/         # Data access abstraction
│   │   ├── routes/             # API endpoint definitions
│   │   ├── middleware/         # Authentication middleware
│   │   ├── validation/         # Zod validation schemas
│   │   ├── database/           # Migrations, seeds, config
│   │   ├── types/              # TypeScript type definitions
│   │   ├── errors/             # Custom error classes
│   │   └── utils/              # Utility functions
│   ├── Dockerfile              # Multi-stage Docker build
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx       # Authentication
│   │   │   ├── Dashboard.tsx   # Role-based dashboard
│   │   │   ├── Works.tsx       # Construction projects list
│   │   │   ├── Suppliers.tsx   # Supplier management
│   │   │   ├── Contracts.tsx   # Contract list with filters
│   │   │   ├── NewContract.tsx # Create contracts
│   │   │   ├── ContractDetails.tsx
│   │   │   ├── NewMeasurement.tsx
│   │   │   ├── MeasurementDetail.tsx
│   │   │   └── RealizedMeasurements.tsx
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React Context (Auth, App state)
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Helper functions
│   │   ├── lib/                # Library integrations
│   │   └── constants.ts        # Application constants
│   ├── Dockerfile              # Multi-stage Docker build
│   └── package.json
├── docker-compose.yml          # Docker orchestration
├── Makefile                    # Development commands
├── setup.sh                    # Automated setup script
├── .env.example                # Environment variables template
└── .elasticbeanstalk/          # AWS deployment config
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd conferir
```

2. Run the automated setup:
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Check for Docker installation
- Generate secure JWT secrets
- Create the `.env` file from `.env.example`
- Configure Git hooks for code quality
- Check port availability (3000, 5173, 5432, 5433)
- Start Docker containers
- Run database migrations automatically

### Manual Setup (Alternative)

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration

3. Start the services:
```bash
docker compose up -d
```

The API will automatically run migrations on startup.

## Development

### Available Make Commands

#### Setup & Installation
```bash
make install          # Install all dependencies
make install-backend  # Install backend dependencies only
make install-frontend # Install frontend dependencies only
```

#### Development
```bash
make dev             # Start all services
make up              # Start all services (alias)
make down            # Stop all services
make restart         # Restart all services
make build           # Rebuild all containers
make update          # Rebuild with fresh dependencies (after git pull)
```

#### Monitoring
```bash
make logs            # View all service logs
make logs-backend    # View backend logs
make logs-frontend   # View frontend logs
make logs-db         # View database logs
make logs-db-test    # View test database logs
make ps              # Show running containers
```

#### Testing
```bash
make test            # Run all tests
make test-backend    # Run backend tests
make test-single file=path/to/test.ts  # Run single test
make test-watch      # Run tests in watch mode
make test-coverage   # Run tests with coverage report
```

#### Code Quality
```bash
make lint            # Run ESLint on all code
make lint-fix        # Run ESLint and auto-fix issues
make format          # Format code with Prettier
make format-check    # Check code formatting
make pre-commit      # Run all checks before commit
```

#### Database
```bash
make db-shell        # Open PostgreSQL shell (dev database)
make db-shell-test   # Open PostgreSQL shell (test database)
make db-reset        # Reset database (⚠️ deletes all data!)
make migrate-latest  # Run pending migrations
make migrate-rollback # Rollback last migration
make migrate-status  # Check migration status
make migrate-make name=migration_name  # Create new migration
make seed-run        # Run database seeds
```

#### Cleanup
```bash
make clean           # Stop and remove containers
make clean-all       # Clean everything including images
```

## Database

### Schema Overview

The application uses PostgreSQL 16 with the following core tables:

- **users** - User accounts with hashed passwords
- **user_types** - Roles and permissions
- **works** - Construction projects with status tracking
- **suppliers** - Service providers (Pessoa Física/Jurídica)
- **contracts** - Service contracts linking works and suppliers
- **contract_items** - Itemized contract line items
- **refresh_tokens** - JWT refresh token management

All tables use UUID primary keys and include timestamps (`created_at`, `updated_at`).

### Migrations

Migrations are managed with Knex.js and run automatically when the API container starts. Migrations are located in [backend/src/database/migrations](backend/src/database/migrations).

## Testing

The project includes a comprehensive test suite using Vitest:

```bash
make test            # Run all tests
make test-watch      # Run tests in watch mode
make test-coverage   # Generate coverage report
```

Tests are located in [backend/src/services/__tests__](backend/src/services/__tests__) and use a separate test database for isolation.

## Code Quality

The project uses ESLint and Prettier for code quality and consistent formatting:

```bash
make lint      # Check for linting errors
make format    # Auto-format code
```

Pre-commit hooks automatically run linting and formatting on staged files using Husky and lint-staged.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### User Types
- `POST /api/user-types` - Create user type
- `GET /api/user-types` - List all user types
- `PUT /api/user-types/:id` - Update user type
- `DELETE /api/user-types/:id` - Delete user type

### Works
- `POST /api/works` - Create work
- `GET /api/works` - List all works
- `GET /api/works/:id` - Get work details
- `PUT /api/works/:id` - Update work
- `DELETE /api/works/:id` - Delete work

### Suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Contracts
- `POST /api/contracts` - Create contract with items
- `GET /api/contracts` - List contracts with optional filters
- `GET /api/contracts/:id` - Get contract details
- `GET /api/contracts/details` - Get enriched contract details

All endpoints except `/api/auth/login` require JWT authentication via the `Authorization: Bearer <token>` header.

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database (Development)
DB_HOST=conf-postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=conf

# Database (Test)
DB_TEST_HOST=conf-postgres-test
DB_TEST_PORT=5432
DB_TEST_USER=postgres
DB_TEST_PASSWORD=postgres
DB_TEST_NAME=conf_test

# Server
BACKEND_PORT=3000
FRONTEND_PORT=5173

# JWT
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=90d
```

## Architecture

The application follows a clean layered architecture:

- **Controllers** - Handle HTTP requests/responses, input validation
- **Services** - Business logic and orchestration
- **Repository** - Data access abstraction with Knex.js
- **Models/Types** - Data structures and TypeScript interfaces

This separation ensures:
- Clear separation of concerns
- Easy testing with mocked dependencies
- Maintainable and scalable codebase
- Type safety throughout the application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Alexandre Silvestri
