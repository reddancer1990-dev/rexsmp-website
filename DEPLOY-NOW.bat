@echo off
cd /d "%~dp0"
echo.
echo Rex SMP website deploy - rexsmp.com
echo.
where gh >nul 2>&1
if errorlevel 1 (
  echo GitHub CLI not found. Run: winget install GitHub.cli
  pause
  exit /b 1
)
gh auth status >nul 2>&1
if errorlevel 1 (
  echo Not logged in. Running gh auth login now...
  gh auth login
)
echo.
for /f %%i in ('gh api user -q .login') do set GHUSER=%%i
echo Logged in as: %GHUSER%
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
echo.
pause
