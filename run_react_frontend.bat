@echo off
echo ========================================
echo Starting React Frontend with HeroUI
echo ========================================
echo.
echo Make sure the Flask backend is running on port 5000!
echo.
cd frontend
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting development server...
call npm run dev
pause

