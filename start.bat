@echo off
set "PATH=D:\vs\MSBuild\Microsoft\VisualStudio\NodeJs;D:\vs\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd;%PATH%"
echo ========================================================
echo  Starting Jeshfique & Faheema Royal Wedding Application
echo  Backend API & SQLite Database + React Production Build
echo ========================================================
echo.
echo Opening http://localhost:5000 in your browser...
start http://localhost:5000
node server/index.js
pause
