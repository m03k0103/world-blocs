@echo off
setlocal
title IR-DB Server Stopper

echo ==========================================================
echo   Stopping IR-DB Local Server (Port 5173)...
echo ==========================================================

set STOPPED=0
for /f "tokens=5" %%a in ('netstat -a -n -o ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    if not "%%a"=="0" (
        echo Terminating process on port 5173 (PID %%a)...
        taskkill /F /PID %%a >nul 2>&1
        set STOPPED=1
    )
)

if "%STOPPED%"=="1" (
    echo [OK] Server stopped successfully.
) else (
    echo [INFO] No running server found on port 5173.
)

timeout /t 2 /nobreak >nul
