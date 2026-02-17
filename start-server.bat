@echo off
cls
echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║   🤖 WhatsApp Auto-Reply Bot                         ║
echo ║   Iniciando o servidor...                             ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo Aguarde enquanto o servidor inicia...
echo.

cd /d "%~dp0"
call npm start

pause
