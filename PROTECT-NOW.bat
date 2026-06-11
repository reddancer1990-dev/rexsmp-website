@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0protect-cloudflare.ps1"
echo.
pause
