@echo off
set "PATH=D:\vs\MSBuild\Microsoft\VisualStudio\NodeJs;D:\vs\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd;%PATH%"
echo Starting Wedding App Development Server (Vite + Node Express)...
start cmd /k "node server/index.js"
start cmd /k "node node_modules\vite\bin\vite.js --open"
