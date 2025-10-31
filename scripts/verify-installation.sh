#!/bin/bash

# StrapiXi Installation Verification Script
# This script checks if all required components are properly configured

set -e

echo "🔍 StrapiXi Installation Verification"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check Node.js version
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 18 ] && [ "$MAJOR_VERSION" -le 20 ]; then
        check_pass "Node.js version $NODE_VERSION (compatible)"
    else
        check_warn "Node.js version $NODE_VERSION (recommended: 18.x or 20.x)"
    fi
else
    check_fail "Node.js not found. Please install Node.js 18.x or 20.x"
    exit 1
fi

# Check npm
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm version $NPM_VERSION"
else
    check_fail "npm not found"
    exit 1
fi

# Check Docker
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    check_pass "Docker version $DOCKER_VERSION"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        check_pass "Docker daemon is running"
    else
        check_warn "Docker daemon is not running. Start with: sudo systemctl start docker"
    fi
else
    check_warn "Docker not found (optional but recommended)"
fi

# Check Docker Compose
echo "Checking Docker Compose..."
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    check_pass "Docker Compose is available"
else
    check_warn "Docker Compose not found (optional but recommended)"
fi

# Check environment file
echo "Checking environment configuration..."
if [ -f ".env" ]; then
    check_pass ".env file exists"
    
    # Check critical variables
    CRITICAL_VARS=("APP_KEYS" "ADMIN_JWT_SECRET" "JWT_SECRET" "DATABASE_CLIENT")
    for var in "${CRITICAL_VARS[@]}"; do
        if grep -q "^$var=" .env && ! grep -q "^$var=toBeModified" .env && ! grep -q "^$var=tobemodified" .env; then
            check_pass "$var is configured"
        else
            check_fail "$var is not properly configured in .env"
        fi
    done
else
    check_fail ".env file not found. Copy from .env.example and configure it"
fi

# Check dependencies
echo "Checking project dependencies..."
if [ -d "node_modules" ]; then
    check_pass "node_modules directory exists"
else
    check_warn "Dependencies not installed. Run: npm install"
fi

# Check database connectivity (if configured)
echo "Checking database configuration..."
if [ -f ".env" ]; then
    DB_CLIENT=$(grep "^DATABASE_CLIENT=" .env | cut -d'=' -f2)
    if [ ! -z "$DB_CLIENT" ]; then
        check_pass "Database client set to: $DB_CLIENT"
        
        if [ "$DB_CLIENT" = "postgres" ] || [ "$DB_CLIENT" = "mysql" ]; then
            DB_HOST=$(grep "^DATABASE_HOST=" .env | cut -d'=' -f2)
            DB_PORT=$(grep "^DATABASE_PORT=" .env | cut -d'=' -f2)
            
            # Try to ping database host
            if command -v nc &> /dev/null; then
                if nc -z -w2 ${DB_HOST:-localhost} ${DB_PORT:-5432} 2>/dev/null; then
                    check_pass "Database server is reachable at $DB_HOST:$DB_PORT"
                else
                    check_warn "Cannot reach database server at $DB_HOST:$DB_PORT"
                fi
            fi
        fi
    fi
fi

# Check Redis connectivity (if configured)
echo "Checking Redis configuration..."
if [ -f ".env" ]; then
    REDIS_HOST=$(grep "^REDIS_HOST=" .env | cut -d'=' -f2)
    REDIS_PORT=$(grep "^REDIS_PORT=" .env | cut -d'=' -f2)
    
    if [ ! -z "$REDIS_HOST" ]; then
        if command -v nc &> /dev/null; then
            if nc -z -w2 ${REDIS_HOST:-localhost} ${REDIS_PORT:-6379} 2>/dev/null; then
                check_pass "Redis server is reachable at $REDIS_HOST:$REDIS_PORT"
            else
                check_warn "Cannot reach Redis server at $REDIS_HOST:$REDIS_PORT"
            fi
        fi
    fi
fi

# Check TypeScript
echo "Checking TypeScript..."
if [ -f "tsconfig.json" ]; then
    check_pass "tsconfig.json exists"
else
    check_fail "tsconfig.json not found"
fi

# Check Strapi files
echo "Checking Strapi configuration..."
CONFIG_FILES=("config/server.ts" "config/database.ts" "config/admin.ts")
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file not found"
    fi
done

# Summary
echo ""
echo "======================================"
echo "Verification Complete!"
echo ""
echo "Next steps:"
echo "1. If .env is not configured, copy .env.example and fill in values"
echo "2. Install dependencies: npm install"
echo "3. Start development server: npm run develop"
echo "4. Or use Docker: docker-compose -f docker-compose.dev.yml up -d"
echo ""
echo "Access the admin panel at: http://localhost:1337/admin"
echo ""
