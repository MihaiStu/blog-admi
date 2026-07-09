@echo off
title AdmiLogistic SEO Toolkit — Auditoria Automatizada
color 0E

echo.
echo ====================================================
echo  INICIANDO AUDITORIA SEO Y ACTUALIZACION DE IA
echo ====================================================
echo.

cd /d "D:\blog-admi"

echo [1/4] Trayendo ultimos cambios de GitHub...
git pull origin main

echo.
echo [2/4] Compilando web y regenerando llms.txt...
call npm run build

echo.
echo [3/4] Ejecutando Auditoria SEO y guardando informe...
node scripts/seo.cjs all > seo_report.md
echo ✓ Informe guardado en: D:\blog-admi\seo_report.md

echo.
echo [4/4] Comprobando cambios en archivos de IA...
git add public/llms.txt public/llms-full.txt
git diff --staged --quiet
if errorlevel 1 (
    echo Cambios detectados en llms.txt. Subiendo a GitHub...
    git commit -m "chore(seo): actualizacion programada automatica de llms.txt"
    git push origin main
    echo ✓ Cambios subidos a GitHub y desplegados en Vercel.
) else (
    echo ✓ No hay cambios en llms.txt. Repositorio al dia.
)

echo.
echo ====================================================
echo  PROCESO COMPLETADO CON EXITO
echo ====================================================
echo.
timeout /t 5
