@echo off
echo ========================================
echo    FAER Formation Conseil - Project
echo ========================================
echo.
echo Starting the application...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy "config.env.example" ".env"
    echo.
    echo Please edit the .env file with your database credentials before starting!
    echo.
    pause
    exit /b
)

echo Starting server...
echo.
npm start

pause 