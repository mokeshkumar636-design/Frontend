@echo off
REM ============================================================
REM  Employee Management - Cucumber BDD Automation Runner
REM  This script starts the dev server and runs 2 Cucumber tests
REM ============================================================

echo.
echo ==========================================
echo  CR7 Sports Portal - Cucumber BDD Tests
echo  Running 2 automated login test scenarios
echo ==========================================
echo.

REM Step 1: Start the Vite dev server in the background
echo [1/3] Starting Employee Management dev server...
cd /d "%~dp0..\DAY 011 employee management"
start "ViteDevServer" cmd /c "npm run dev"
echo      Dev server starting at http://localhost:5173

REM Wait 6 seconds for Vite to boot
echo      Waiting for server to be ready...
timeout /t 6 /nobreak > nul

REM Step 2: Run Maven tests
echo.
echo [2/3] Running Cucumber tests (2 scenarios)...
cd /d "%~dp0"
call mvn test -Dtest=TestRunner

REM Step 3: Show result
echo.
echo [3/3] Test execution complete!
echo.
echo Reports generated at:
echo   - target\cucumber-reports\report.html
echo   - target\cucumber-reports\cucumber.json
echo.

REM Open the HTML report automatically
if exist "target\cucumber-reports\report.html" (
    echo Opening HTML report in browser...
    start "" "target\cucumber-reports\report.html"
) else (
    echo HTML report not found. Check Maven output above for errors.
)

echo.
echo ==========================================
echo  Done! Press any key to close this window
echo ==========================================
pause > nul
