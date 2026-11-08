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

REM 3. Check if server is already running (Behavior 1: Reuse existing server)
set RUNNING_PORT=
for /f "usebackq tokens=*" %%p in (`node scripts/port_helper.cjs check-running 2^>nul`) do set RUNNING_PORT=%%p

if "%RUNNING_PORT%"=="" goto :START_NEW

echo [INFO] Existing Vite server is already active on port %RUNNING_PORT%.
echo Opening IR-DB in browser: http://localhost:%RUNNING_PORT%/
start http://localhost:%RUNNING_PORT%/
echo ==========================================================
echo   Reusing active server. Source changes auto-reload via HMR.
echo   You can close this window now.
echo ==========================================================
ping -n 3 127.0.0.1 >nul 2>&1
exit /b 0

:START_NEW
REM 4. Detect available port (World config from ports.json or 8006/8056)
set TARGET_PORT=
for /f "usebackq tokens=*" %%p in (`node scripts/port_helper.cjs get-port`) do set TARGET_PORT=%%p

if "%TARGET_PORT%"=="" (
    echo [ERROR] Failed to determine an available port.
    pause
    exit /b 1
)

echo Selected port: %TARGET_PORT%
echo %TARGET_PORT%>.server_port

REM 5. Launch Vite server in a separate background window
echo Starting Vite Development Server on http://localhost:%TARGET_PORT%...
start "IR-DB Vite Server" cmd /c "npm run dev -- --port %TARGET_PORT% --strictPort"

REM 6. Wait for server to become ready (HTTP readiness check and PID recording)
echo Waiting for server to initialize on http://localhost:%TARGET_PORT%...
node scripts/port_helper.cjs wait-ready %TARGET_PORT%

REM 7. Open in default browser
echo Opening IR-DB in browser: http://localhost:%TARGET_PORT%/
start http://localhost:%TARGET_PORT%/

echo ==========================================================
echo   Server is running in background on port %TARGET_PORT%.
echo   You can close this window now.
echo ==========================================================
ping -n 3 127.0.0.1 >nul 2>&1
