# HireDesk Auth API - Docker Makefile
# Simplifies Docker operations for development and deployment

.PHONY: help build up down restart logs clean dev prod test health migrate shell db-shell backup restore

# Default target
help:
	@echo "HireDesk Auth API - Docker Commands"
	@echo "===================================="
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start development environment (with PostgreSQL & PGAdmin)"
	@echo "  make dev-logs         - View development logs"
	@echo "  make dev-down         - Stop development environment"
	@echo ""
	@echo "Production:"
	@echo "  make prod             - Start production environment (NeonDB)"
	@echo "  make prod-logs        - View production logs"
	@echo "  make prod-down        - Stop production environment"
	@echo ""
	@echo "Local:"
	@echo "  make local            - Start with local PostgreSQL"
	@echo "  make local-down       - Stop local environment"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build            - Build Docker images"
	@echo "  make build-no-cache   - Build without cache"
	@echo "  make up               - Start all services"
	@echo "  make down             - Stop all services"
	@echo "  make restart          - Restart all services"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs             - View all logs"
	@echo "  make logs-api         - View API logs only"
	@echo "  make logs-db          - View database logs"
	@echo "  make health           - Check service health"
	@echo "  make ps               - List running containers"
	@echo "  make stats            - Show resource usage"
	@echo ""
	@echo "Database:"
	@echo "  make migrate          - Run database migrations"
	@echo "  make migrate-generate - Generate new migration"
	@echo "  make db-shell         - Access PostgreSQL shell"
	@echo "  make backup           - Backup database"
	@echo "  make restore          - Restore database from backup"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell            - Access API container shell"
	@echo "  make test             - Run tests in container"
	@echo "  make clean            - Remove containers and volumes"
	@echo "  make clean-all        - Remove everything including images"
	@echo "  make prune            - Clean up Docker system"
	@echo ""

# ============================================
# Development Environment
# ============================================

dev:
	@echo "🚀 Starting development environment..."
	docker-compose --profile development up -d
	@echo "✅ Development environment started"
	@echo "📝 API: http://localhost:5000"
	@echo "🗄️  PGAdmin: http://localhost:8080 (admin@hiredesk.com / admin)"

dev-logs:
	docker-compose --profile development logs -f

dev-down:
	@echo "🛑 Stopping development environment..."
	docker-compose --profile development down
	@echo "✅ Development environment stopped"

# ============================================
# Production Environment
# ============================================

prod:
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "✅ Production environment started"
	@echo "📝 API: http://localhost:5000"

prod-logs:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

prod-down:
	@echo "🛑 Stopping production environment..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
	@echo "✅ Production environment stopped"

# ============================================
# Local Environment
# ============================================

local:
	@echo "🚀 Starting local environment..."
	docker-compose --profile local up -d
	@echo "✅ Local environment started"
	@echo "📝 API: http://localhost:5000"
	@echo "🗄️  PostgreSQL: localhost:5432"

local-down:
	@echo "🛑 Stopping local environment..."
	docker-compose --profile local down
	@echo "✅ Local environment stopped"

# ============================================
# Build & Deploy
# ============================================

build:
	@echo "🔨 Building Docker images..."
	docker-compose build
	@echo "✅ Build complete"

build-no-cache:
	@echo "🔨 Building Docker images (no cache)..."
	docker-compose build --no-cache
	@echo "✅ Build complete"

up:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started"

down:
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped"

restart:
	@echo "🔄 Restarting services..."
	docker-compose restart
	@echo "✅ Services restarted"

# ============================================
# Monitoring
# ============================================

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f hiredesk-auth-api

logs-db:
	docker-compose logs -f postgres

health:
	@echo "🏥 Checking service health..."
	@curl -s http://localhost:5000/health | python -m json.tool || echo "❌ API not responding"
	@docker-compose ps

ps:
	docker-compose ps

stats:
	docker stats hiredesk-auth-api hiredesk-postgres

# ============================================
# Database Operations
# ============================================

migrate:
	@echo "📊 Running database migrations..."
	docker exec hiredesk-auth-api npm run db:migrate
	@echo "✅ Migrations complete"

migrate-generate:
	@echo "📊 Generating new migration..."
	docker exec hiredesk-auth-api npm run db:generate
	@echo "✅ Migration generated"

db-shell:
	@echo "🗄️  Accessing PostgreSQL shell..."
	docker exec -it hiredesk-postgres psql -U hiredesk_user -d hiredesk_auth

backup:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker exec hiredesk-postgres pg_dump -U hiredesk_user hiredesk_auth > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup created in backups/ directory"

restore:
	@echo "📥 Restoring database from backup..."
	@echo "Available backups:"
	@ls -1 backups/*.sql
	@echo ""
	@read -p "Enter backup filename: " filename; \
	cat backups/$$filename | docker exec -i hiredesk-postgres psql -U hiredesk_user -d hiredesk_auth
	@echo "✅ Database restored"

# ============================================
# Utilities
# ============================================

shell:
	@echo "🐚 Accessing API container shell..."
	docker exec -it hiredesk-auth-api sh

test:
	@echo "🧪 Running tests..."
	docker exec hiredesk-auth-api npm test

test-coverage:
	@echo "🧪 Running tests with coverage..."
	docker exec hiredesk-auth-api npm run test:coverage

clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose down -v
	@echo "✅ Cleanup complete"

clean-all:
	@echo "🧹 Removing everything (containers, volumes, images)..."
	docker-compose down -v --rmi all
	@echo "✅ Complete cleanup done"

prune:
	@echo "🧹 Pruning Docker system..."
	docker system prune -f
	@echo "✅ System pruned"

# ============================================
# Advanced Operations
# ============================================

scale:
	@read -p "Number of API replicas: " replicas; \
	docker-compose up -d --scale hiredesk-auth-api=$$replicas

inspect-api:
	docker inspect hiredesk-auth-api | python -m json.tool

inspect-db:
	docker inspect hiredesk-postgres | python -m json.tool

network-inspect:
	docker network inspect hiredesk-network

volume-inspect:
	docker volume inspect hiredesk_postgres_data

# ============================================
# CI/CD Helpers
# ============================================

ci-build:
	docker-compose build --no-cache

ci-test:
	docker-compose run --rm hiredesk-auth-api npm run test:coverage

ci-deploy:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# ============================================
# Security
# ============================================

scan:
	@echo "🔍 Scanning images for vulnerabilities..."
	docker scan hiredesk-auth-api || echo "Docker scan not available, install Snyk"

security-check:
	@echo "🔒 Running security audit..."
	docker exec hiredesk-auth-api npm audit

# ============================================
# Performance
# ============================================

benchmark:
	@echo "⚡ Running performance benchmark..."
	docker exec hiredesk-auth-api npm run perf:benchmark

loadtest:
	@echo "📈 Running load test..."
	@echo "Please ensure autocannon is installed: npm install -g autocannon"
	autocannon -c 100 -d 30 http://localhost:5000/health
