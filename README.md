# ERP Conferir Engenharia

A full-stack web application for managing construction project contracts, measurements, and payment tracking.

## Overview

Payment Measurement System is an ERP solution designed for construction companies to:
- Manage contracts for construction projects in progress
- Create and track measurements for contract work
- Control purchases and invoices related to work execution
- Handle role-based access for directors and site managers

## Technology Stack

### Backend
- **Runtime:** Node.js 20 (TypeScript)
- **Framework:** Express.js
- **Database:** PostgreSQL 16
- **Query Builder:** Knex.js
- **Authentication:** JWT with Argon2/bcrypt password hashing
- **Security:** Helmet, CORS
- **Testing:** Vitest with coverage support

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Validation:** Zod

### Infrastructure
- **Containerization:** Docker with multi-stage builds
- **Orchestration:** Docker Compose (API, Client, PostgreSQL)
- **Development:** Hot-reload enabled for rapid development

## Project Structure

```
payment-measurement-system/
├── backend/               # Express API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── repository/    # Data access layer
│   │   ├── models/        # Data models
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   └── database/      # Migrations & seeds
│   └── Dockerfile
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── context/       # State management
│   └── Dockerfile
└── docker-compose.yml
```

## Features

### Contract Management
- Create and manage construction contracts
- Track contract items and pricing
- Monitor contract status (Active/Closed)

### Measurement System
- Create measurements from contracts
- Track measurement status (Draft, Pending, Approved, Rejected)
- Director approval workflow with observations

### Purchasing and invoice management
- Add Tax Invoices
- Extract data to create filter reports
- Track budget (Draft, Pending, Approved/Reject, Transport, Received)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payment-measurement-system
```

2. Run the automated setup:
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Generate a secure JWT secret
- Create the `.env` file from `.env.example`
- Configure Git hooks
- Check port availability
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
docker compose up
```

## Development

### Available Make Commands

```bash
make dev          # Start all services in development mode
make down         # Stop all services
make logs         # View all service logs
make test         # Run backend tests
make lint         # Run ESLint checks
make format       # Format code with Prettier
make db-shell     # Access PostgreSQL shell
make migrate-make # Create a new migration
make migrate-up   # Run pending migrations
make migrate-down # Rollback last migration
```

## Database

The application uses PostgreSQL with Knex.js for migrations. Migrations run automatically when the API container starts.

## Testing

Run the test suite:
```bash
make test
```

Tests are located in `backend/src/services/__test__/` and use Vitest.

## Code Quality

The project uses ESLint and Prettier for code quality:

```bash
make lint      # Check for linting errors
make format    # Auto-format code
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Alexandre Silvestri

## Architecture

The application follows a layered architecture:

- **Controllers:** Handle HTTP requests/responses
- **Services:** Business logic and validation
- **Repository:** Data access abstraction
- **Models:** Data structures and types

Authentication uses JWT tokens with secure password hashing (Argon2/bcrypt).