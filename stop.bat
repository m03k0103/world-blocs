@echo off
setlocal
cd /d "%~dp0"
title IR-DB Server Stopper

echo ==========================================================
echo   Stopping IR-DB Local Server...
echo ==========================================================

set STOPPED=0
set TARGET_PID=

if not exist ".server_pid" goto :NO_PID
set /p TARGET_PID=<.server_pid
if "%TARGET_PID%"=="" goto :NO_PID

echo Found recorded server PID: %TARGET_PID%
tasklist /FI "PID eq %TARGET_PID%" 2>nul | findstr "%TARGET_PID%" >nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Server process PID %TARGET_PID% is not currently running.
    del /f /q ".server_pid" >nul 2>&1
    goto :CLEANUP_PORT
)

echo Terminating server process tree for PID %TARGET_PID%...
taskkill /F /T /PID %TARGET_PID% >nul 2>&1
set STOPPED=1
echo [OK] IR-DB server (PID %TARGET_PID%) stopped successfully.
del /f /q ".server_pid" >nul 2>&1
goto :CLEANUP_PORT

:NO_PID
echo [INFO] No running server recorded (.server_pid not found).

:CLEANUP_PORT
if exist ".server_port" del /f /q ".server_port" >nul 2>&1

if "%STOPPED%"=="0" (
    echo [INFO] No active IR-DB server instance was stopped.
)

echo ==========================================================
ping -n 3 127.0.0.1 >nul 2>&1
