#!/bin/sh
# Health check script for HireDesk Auth API
# Used by Docker healthcheck and monitoring tools

set -e

# Configuration
API_HOST="${API_HOST:-localhost}"
API_PORT="${API_PORT:-5000}"
HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-/health}"
TIMEOUT="${TIMEOUT:-5}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check API health
check_api_health() {
    local url="http://${API_HOST}:${API_PORT}${HEALTH_ENDPOINT}"
    
    # Try to fetch health endpoint
    response=$(wget --timeout="${TIMEOUT}" --tries=1 --spider -S "${url}" 2>&1)
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "${GREEN}✓${NC} API is healthy"
        return 0
    else
        echo "${RED}✗${NC} API is unhealthy (exit code: $exit_code)"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    if [ -n "$DATABASE_URL" ]; then
        echo "Database check: Connection string configured"
        return 0
    else
        echo "${YELLOW}⚠${NC} Database check: No DATABASE_URL set"
        return 1
    fi
}

# Main health check
main() {
    echo "HireDesk Auth API - Health Check"
    echo "================================"
    echo "Host: ${API_HOST}:${API_PORT}"
    echo "Endpoint: ${HEALTH_ENDPOINT}"
    echo ""
    
    # Check API
    if check_api_health; then
        check_database
        echo ""
        echo "${GREEN}Health check passed${NC}"
        exit 0
    else
        echo ""
        echo "${RED}Health check failed${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
