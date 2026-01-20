#!/bin/bash
# Development Service Manager for Teach Charlie AI
# Usage: ./scripts/dev-start.sh [start|stop|restart|status]
#
# ⛔ IMPORTANT: This script uses Docker Compose for Langflow.
#    NEVER use Langflow Desktop App - it uses a separate database!

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_PORT=3001
BACKEND_PORT=8000
LANGFLOW_PORT=7860
NGINX_PORT=7861

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -9 2>/dev/null || true
        log_info "Killed processes on port $port"
    fi
}

check_port() {
    local port=$1
    local name=$2
    if lsof -i:$port >/dev/null 2>&1; then
        echo -e "${GREEN}●${NC} $name (port $port): Running"
        return 0
    else
        echo -e "${RED}●${NC} $name (port $port): Stopped"
        return 1
    fi
}

check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running!"
        log_info "Please start Docker Desktop and try again."
        log_info "On macOS: open -a Docker"
        exit 1
    fi
}

start_services() {
    log_info "Starting Teach Charlie AI development services..."
    echo ""

    # Check Docker is running
    check_docker

    # Kill any existing processes on host ports
    kill_port $FRONTEND_PORT
    kill_port $BACKEND_PORT

    # Start Docker services (PostgreSQL + Langflow + nginx)
    if ! curl -s http://localhost:$LANGFLOW_PORT/health >/dev/null 2>&1; then
        log_info "Starting Docker services (PostgreSQL, Langflow, nginx)..."
        cd "$PROJECT_ROOT" && docker-compose -f docker-compose.dev.yml up -d

        # Wait for Langflow to be healthy
        log_info "Waiting for Langflow to be ready..."
        for i in {1..30}; do
            if curl -s http://localhost:$LANGFLOW_PORT/health >/dev/null 2>&1; then
                log_info "Langflow is ready!"
                break
            fi
            sleep 2
        done
    else
        log_info "Docker services already running"
    fi

    # Start backend on host
    log_info "Starting backend on port $BACKEND_PORT..."
    cd "$PROJECT_ROOT/src/backend"
    nohup python3 -m uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT --reload > /tmp/backend.log 2>&1 &

    # Start frontend on host
    log_info "Starting frontend on port $FRONTEND_PORT..."
    cd "$PROJECT_ROOT/src/frontend"
    nohup npm run dev > /tmp/frontend.log 2>&1 &

    # Wait for services to start
    sleep 4

    # Verify
    echo ""
    log_info "Checking service status..."
    status_services

    echo ""
    log_info "Logs available at:"
    echo "  Backend:  tail -f /tmp/backend.log"
    echo "  Frontend: tail -f /tmp/frontend.log"
    echo "  Langflow: docker-compose -f docker-compose.dev.yml logs -f langflow"
    echo ""
    log_info "Test URL: http://localhost:$FRONTEND_PORT/dashboard"
}

stop_services() {
    log_info "Stopping development services..."
    kill_port $FRONTEND_PORT
    kill_port $BACKEND_PORT
    log_info "Host services stopped (Docker services left running)"
    log_info "To stop Docker: docker-compose -f docker-compose.dev.yml down"
}

status_services() {
    echo "Service Status:"
    echo "---------------"
    check_port $FRONTEND_PORT "Frontend (host)"
    check_port $BACKEND_PORT "Backend (host)"

    # Check Docker services
    if curl -s http://localhost:$LANGFLOW_PORT/health >/dev/null 2>&1; then
        echo -e "${GREEN}●${NC} Langflow (port $LANGFLOW_PORT): Running (Docker)"
    else
        echo -e "${RED}●${NC} Langflow (port $LANGFLOW_PORT): Stopped"
    fi

    if curl -s http://localhost:$NGINX_PORT/health >/dev/null 2>&1; then
        echo -e "${GREEN}●${NC} Nginx proxy (port $NGINX_PORT): Running (Docker)"
    else
        echo -e "${RED}●${NC} Nginx proxy (port $NGINX_PORT): Stopped"
    fi

    # Check PostgreSQL
    if docker-compose -f "$PROJECT_ROOT/docker-compose.dev.yml" ps postgres 2>/dev/null | grep -q "Up"; then
        echo -e "${GREEN}●${NC} PostgreSQL (port 5432): Running (Docker)"
    else
        echo -e "${RED}●${NC} PostgreSQL (port 5432): Stopped"
    fi
}

case "${1:-start}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        status_services
        ;;
    docker-down)
        log_info "Stopping ALL services including Docker..."
        kill_port $FRONTEND_PORT
        kill_port $BACKEND_PORT
        cd "$PROJECT_ROOT" && docker-compose -f docker-compose.dev.yml down
        log_info "All services stopped"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|docker-down}"
        echo ""
        echo "Commands:"
        echo "  start       Start all services (Docker + host)"
        echo "  stop        Stop host services (keeps Docker running)"
        echo "  restart     Restart all services"
        echo "  status      Show service status"
        echo "  docker-down Stop everything including Docker containers"
        exit 1
        ;;
esac
