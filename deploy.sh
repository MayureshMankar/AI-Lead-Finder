#!/bin/bash

# AI Lead Finder - Production Deployment Script
# This script sets up the application for production deployment

set -e  # Exit on any error

echo "🚀 AI Lead Finder - Production Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check MySQL
if ! command -v mysql &> /dev/null; then
    print_warning "MySQL is not installed. Please install it first."
    exit 1
fi

print_status "Prerequisites check passed!"

# Create virtual environment
print_status "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ai-lead-finder-ui
npm install
npm run build
cd ..

# Check environment file
if [ ! -f .env ]; then
    print_warning "No .env file found. Creating from template..."
    cp env.example .env
    print_status "Please edit .env file with your credentials before continuing"
    print_status "Required variables:"
    echo "  - LINKEDIN_EMAIL"
    echo "  - LINKEDIN_PASSWORD"
    echo "  - DATABASE_URL"
    echo "  - JWT_SECRET_KEY"
    echo "  - MAIL_USERNAME"
    echo "  - MAIL_PASSWORD"
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
source .env

# Check required environment variables
required_vars=("LINKEDIN_EMAIL" "LINKEDIN_PASSWORD" "DATABASE_URL" "JWT_SECRET_KEY" "MAIL_USERNAME" "MAIL_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_status "Environment variables check passed!"

# Run database migrations
print_status "Running database migrations..."
python migrate_db.py
python migrate_billing.py

# Test the application
print_status "Testing application..."
python -c "
import sys
sys.path.append('.')
from production_config import validate_production_setup, get_production_status

try:
    validate_production_setup()
    status = get_production_status()
    print(f'✅ Production setup validated!')
    print(f'   Working scrapers: {status[\"working_scrapers\"]}')
    print(f'   Ready for deployment: {status[\"ready_for_deployment\"]}')
except Exception as e:
    print(f'❌ Production setup failed: {e}')
    sys.exit(1)
"

# Create systemd service file
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/aileads.service > /dev/null <<EOF
[Unit]
Description=AI Lead Finder API
After=network.target mysql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=PATH=$(pwd)/venv/bin
ExecStart=$(pwd)/venv/bin/python api_server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create nginx configuration
print_status "Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/aileads > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        root $(pwd)/ai-lead-finder-ui/.next;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /_next/static {
        alias $(pwd)/ai-lead-finder-ui/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable nginx site
print_status "Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/aileads /etc/nginx/sites-enabled/
sudo nginx -t

# Start services
print_status "Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable aileads
sudo systemctl start aileads
sudo systemctl reload nginx

# Check service status
print_status "Checking service status..."
sleep 5

if sudo systemctl is-active --quiet aileads; then
    print_status "✅ AI Lead Finder service is running!"
else
    print_error "❌ AI Lead Finder service failed to start"
    sudo systemctl status aileads
    exit 1
fi

if sudo systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running!"
else
    print_error "❌ Nginx failed to start"
    sudo systemctl status nginx
    exit 1
fi

# Final status
print_status "🎉 Deployment completed successfully!"
echo ""
echo "📋 Service Information:"
echo "  - Backend API: http://localhost:5001"
echo "  - Frontend: http://localhost"
echo "  - Service: aileads"
echo ""
echo "🔧 Useful Commands:"
echo "  - View logs: sudo journalctl -u aileads -f"
echo "  - Restart service: sudo systemctl restart aileads"
echo "  - Check status: sudo systemctl status aileads"
echo ""
echo "🔒 Security Recommendations:"
echo "  - Set up SSL/HTTPS with Let's Encrypt"
echo "  - Configure firewall (UFW)"
echo "  - Set up automated backups"
echo "  - Monitor logs regularly"
echo ""
print_status "Your AI Lead Finder is now live! 🚀" 