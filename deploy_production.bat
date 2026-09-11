@echo off
echo ================================================================
echo  FloodGuard AI - Production Deployment Script
echo ================================================================
echo.

echo [1/3] Building Frontend...
cd "%~dp0floodguard-frontend"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Frontend build FAILED. Fix build errors before deploying.
    pause
    exit /b 1
)
echo [OK] Frontend build successful.
echo.

echo [2/3] Deploying Frontend to Vercel...
echo Checking if Vercel CLI is available...
call npx vercel --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing Vercel CLI...
    call npm install -g vercel
)
echo Deploying to Vercel production...
call npx vercel --prod --yes
echo [OK] Vercel deploy triggered.
echo.

echo [3/3] Backend Render auto-deploys from GitHub push.
echo Your latest code was already pushed. Render will deploy automatically.
echo Check: https://dashboard.render.com
echo Backend URL: https://floodguard-ai-23yq.onrender.com/docs
echo.

echo ================================================================
echo  Deployment Complete!
echo ================================================================
pause
