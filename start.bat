@echo off
setlocal
cd /d "%~dp0"
title IR-DB Local Server Starter

echo ==========================================================
echo   International Relations Database (IR-DB)
echo   Local Server Starter
echo ==========================================================

REM 1. Check Node.js and npm
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found. Please install Node.js.
    pause
    exit /b 1
)

REM 2. Install dependencies if node_modules does not exist
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

REM 3. Stop any existing process listening on port 5173
echo Checking port 5173...
for /f "tokens=5" %%a in ('netstat -a -n -o ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    if not "%%a"=="0" (
        echo Stopping existing process on port 5173 (PID %%a)
        taskkill /F /PID %%a >nul 2>&1
    )
)

REM 4. Launch Vite server in a separate background window
echo Starting Vite Development Server on http://localhost:5173...
start "IR-DB Vite Server" cmd /c "npm run dev -- --port 5173"

REM 5. Wait for server to become ready (HTTP readiness check via Node.js)
echo Waiting for server to initialize and respond on http://localhost:5173...
node -e "const http = require('http'); const start = Date.now(); function check() { http.get('http://localhost:5173/', (res) => { console.log('Server is ready (HTTP ' + res.statusCode + ')'); process.exit(0); }).on('error', () => { if (Date.now() - start > 15000) { console.log('[WARN] Server initialization timeout'); process.exit(0); } setTimeout(check, 300); }); } check();"

REM 6. Open in default browser
echo Opening IR-DB in browser: http://localhost:5173/
start http://localhost:5173/

echo ==========================================================
echo   Server is running in background.
echo   You can close this window now.
echo ==========================================================
timeout /t 2 /nobreak >nul
