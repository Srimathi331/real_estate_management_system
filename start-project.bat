@echo off
echo ========================================
echo   Real Estate Management System
echo ========================================
echo.

echo 1. Testing MongoDB Atlas connection...
cd backend
node test-connection.js

echo.
echo 2. Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo.
echo 3. Starting frontend development server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to close this window...
pause > nul