@echo off
set "file=%~1"
set "line=%2"
set "col=%3"

if "%line%"=="" set "line=1"
if "%col%"=="" set "col=1"

antigravity -g "%file%:%line%:%col%"
