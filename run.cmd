@echo off

title Exercise runner

cd data
cd node
cd kickstarter


:start

"./node.exe" %~dp0data/loader.js %answer%

timeout /t 2 /nobreak

goto start



pause