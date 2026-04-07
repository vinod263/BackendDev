@echo off
REM Quick start script for local development

echo ========================================
echo Perplexity Chat - Local Setup
echo ========================================
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo [!] Creating backend/.env from template...
    copy backend\.env.example backend\.env
    echo [*] IMPORTANT: Update backend/.env with your MongoDB URI and API keys
    pause
)

if not exist "frontend\.env.local" (
    echo [!] Creating frontend/.env.local from template...
    copy frontend\.env.example frontend\.env.local
    echo [*] Frontend .env.local created
)

REM Install dependencies
echo.
echo [*] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [*] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start development:
echo   1. Terminal 1: npm run dev (in backend folder)
echo   2. Terminal 2: npm run dev (in frontend folder)
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
