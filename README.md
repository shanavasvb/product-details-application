# product-details-application

# Installation Guide

> **Installation Date:** 2025-08-31 11:04:55 UTC  
> **Setup by:** shanavasvb  
> **Project:** Product Details Application with AI-Powered Barcode Search

## 🔧 Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0
- **Python** >= 3.8.0  
- **MongoDB** >= 5.0.0
- **npm** >= 8.0.0
- **pip** >= 21.0.0
- **Git** (for cloning)

## 🚀 Complete Installation

### 1. Clone Repository & Initial Setup
```bash
git clone <your-repo-url>
cd product-details-application

# Verify project structure
ls -la
# Should show: backend/ frontend/ README.md requirements.txt
```

### 2. Backend Installation
```bash
cd backend

# Install Node.js dependencies
npm install express@^4.18.2 cors@^2.8.5 dotenv@^16.6.0 mongoose@^7.5.0 bcryptjs@^2.4.3 jsonwebtoken@^9.0.2 axios@^1.5.0

# Install development dependencies
npm install --save-dev nodemon@^3.1.10

# Create Python virtual environment
python -m venv python_env

# Activate Python environment
source python_env/bin/activate  # Linux/macOS
# python_env\Scripts\activate  # Windows

# Install Python AI dependencies
pip install google-generativeai==0.3.2 requests==2.31.0 python-dotenv==1.0.0 pandas==2.0.3 numpy==1.24.3 json5==0.9.14

# Verify Python installation
python --version && pip list
```

### 3. Frontend Installation
```bash
# Navigate to frontend (from project root)
cd frontend

# Install React dependencies
npm install

# Verify installation
npm list --depth=0
```

### 4. Environment Configuration

#### Backend Environment (.env)
```bash
# Create backend/.env file
cat > backend/.env << 'EOF'
# =============================================================================
# BACKEND ENVIRONMENT CONFIGURATION
# =============================================================================
# Created: 2025-08-31 11:04:55 UTC
# User: shanavasvb

# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/product_details_db

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long_2025

# AI Configuration - Google Gemini
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Python Script Configuration
PYTHON_SCRIPT_PATH=./utils/barcode_api_processor.py
PYTHON_ENV_PATH=./python_env/bin/python

# API Configuration
API_TIMEOUT=30000
MAX_BARCODES_PER_REQUEST=50

# Logging
LOG_LEVEL=debug
EOF
```

#### Frontend Environment (.env)
```bash
# Create frontend/.env file
cat > frontend/.env << 'EOF'
# =============================================================================
# FRONTEND ENVIRONMENT CONFIGURATION  
# =============================================================================
# Created: 2025-08-31 11:04:55 UTC
# User: shanavasvb

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_API_TIMEOUT=30000

# Application Configuration
REACT_APP_ENV=development
REACT_APP_APP_NAME=Product Details Application
REACT_APP_VERSION=1.0.0

# UI Configuration
REACT_APP_ITEMS_PER_PAGE=20
REACT_APP_MAX_BARCODE_LENGTH=20

# Feature Flags
REACT_APP_ENABLE_BARCODE_SCANNER=true
REACT_APP_ENABLE_BULK_OPERATIONS=true
REACT_APP_ENABLE_AI_FEATURES=true

# Development Configuration
GENERATE_SOURCEMAP=true
REACT_APP_DEBUG=true
EOF
```

### 5. Database Setup
```bash
# Start MongoDB service
# Linux:
sudo systemctl start mongod
sudo systemctl enable mongod

# macOS:
brew services start mongodb-community

# Windows: Start MongoDB service from Services panel

# Verify MongoDB connection
mongosh --eval "db.runCommand('ping')"

# Create database and test connection
mongosh product_details_db --eval "db.test.insertOne({test: 'connection', date: new Date()})"
```

### 6. Directory Structure Verification
```bash
# Verify complete project structure
tree -L 3 -a
# Expected structure:
# ├── backend/
# │   ├── .env
# │   ├── controllers/
# │   ├── models/
# │   ├── routes/
# │   ├── utils/
# │   ├── python_env/
# │   ├── package.json
# │   └── server.js
# ├── frontend/
# │   ├── .env
# │   ├── public/
# │   ├── src/
# │   ├── package.json
# │   └── node_modules/
# ├── README.md
# └── requirements.txt
```

## ▶️ Running the Application

### Terminal 1 - Backend Server
```bash
cd backend

# Activate Python environment
source python_env/bin/activate  # Linux/macOS
# python_env\Scripts\activate    # Windows

# Start backend server
npm run dev

# Expected output:
# [nodemon] starting `node server.js`
# Server running on port 5000
# Connected to MongoDB
# Default admin created
```

### Terminal 2 - Frontend Server
```bash
cd frontend

# Start React development server
npm start

# Expected output:
# Compiled successfully!
# You can now view auth-frontend in the browser.
# Local: http://localhost:3000
```

### Terminal 3 - MongoDB Monitor (Optional)
```bash
# Monitor MongoDB logs
mongosh product_details_db --eval "db.products.find().limit(5).pretty()"
```

## 🌐 Access Points & Default Credentials

### Application URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **MongoDB:** mongodb://localhost:27017/product_details_db

### Default Admin Account
```
Phone Number: 1234567890
Password: admin123
Role: Administrator
```

### API Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/v1/auth/login

# Test barcode search
curl -X POST http://localhost:5000/api/v1/product/search-by-barcodes \
  -H "Content-Type: application/json" \
  -d '{"barcodes": ["8901234567890"]}'
```

## ✅ Installation Verification

### 1. Backend Health Check
```bash
cd backend

# Check Node.js dependencies
npm list express mongoose axios

# Check Python dependencies  
pip show google-generativeai requests

# Test API endpoints
curl -f http://localhost:5000/api/v1/auth/login || echo "Backend not ready"
```

### 2. Frontend Health Check
```bash
cd frontend

# Check React dependencies
npm list react react-dom antd

# Check if frontend builds
npm run build

# Test frontend access
curl -f http://localhost:3000 || echo "Frontend not ready"
```

### 3. Database Health Check
```bash
# Test MongoDB connection
mongosh product_details_db --eval "db.runCommand('ping').ok" --quiet

# Check collections
mongosh product_details_db --eval "show collections"

# Verify admin user creation
mongosh product_details_db --eval "db.users.findOne({phoneNumber: '1234567890'})"
```

### 4. AI Integration Check
```bash
cd backend

# Test Python environment
source python_env/bin/activate
python -c "import google.generativeai as genai; print('AI integration ready')"

# Test barcode processing script
python utils/barcode_api_processor.py --test
```

## 🔧 Troubleshooting

### Common Port Issues
```bash
# Kill processes on required ports
sudo lsof -ti:3000 | xargs kill -9  # Frontend
sudo lsof -ti:5000 | xargs kill -9  # Backend
sudo lsof -ti:27017 | xargs kill -9 # MongoDB
```

### Environment Issues
```bash
# Reset Python environment
rm -rf backend/python_env
cd backend
python -m venv python_env
source python_env/bin/activate
pip install google-generativeai requests python-dotenv pandas numpy json5

# Reset Node modules
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
cd backend && npm install
cd ../frontend && npm install
```

### Database Issues
```bash
# Restart MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS

# Reset database (CAUTION: Deletes all data)
mongosh product_details_db --eval "db.dropDatabase()"
```

### Permission Issues (Linux/macOS)
```bash
# Fix Python environment permissions
chmod +x backend/python_env/bin/activate
chmod +x backend/utils/barcode_api_processor.py

# Fix MongoDB permissions
sudo chown -R $USER:$USER /data/db
```

## 🎯 Installation Complete Checklist

- [ ] ✅ Node.js dependencies installed (backend & frontend)
- [ ] ✅ Python virtual environment created
- [ ] ✅ AI dependencies installed (Google Gemini API)
- [ ] ✅ Environment files configured (.env)
- [ ] ✅ MongoDB running and connected
- [ ] ✅ Backend server running on port 5000
- [ ] ✅ Frontend server running on port 3000
- [ ] ✅ Default admin account created
- [ ] ✅ API endpoints responding
- [ ] ✅ Database collections initialized
- [ ] ✅ Python AI scripts executable


