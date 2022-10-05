@echo off

cd data
cd node
cd kickstarter

start cmd /k node.exe %~dp0/data/loader.js %answer%

pause