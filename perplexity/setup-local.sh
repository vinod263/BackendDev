#!/bin/bash

# Quick start script for local development on Linux/Mac

echo "========================================"
echo "Perplexity Chat - Local Setup"
echo "========================================"
echo ""

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "[!] Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "[*] IMPORTANT: Update backend/.env with your MongoDB URI and API keys"
    read -p "Press Enter to continue..."
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "[!] Creating frontend/.env.local from template..."
    cp frontend/.env.example frontend/.env.local
    echo "[*] Frontend .env.local created"
fi

# Install dependencies
echo ""
echo "[*] Installing backend dependencies..."
cd backend
npm install --legacy-peer-deps
cd ..

echo ""
echo "[*] Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start development:"
echo "  1. Terminal 1: npm run dev (in backend folder)"
echo "  2. Terminal 2: npm run dev (in frontend folder)"
echo ""
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
