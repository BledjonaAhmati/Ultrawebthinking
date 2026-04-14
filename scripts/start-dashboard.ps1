# 🚀 Start Dashboard Only
# Quick script to start just the dashboard

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🌐 Starting Web Dashboard" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspace = Split-Path -Parent $scriptRoot
$dashboardPath = Join-Path $workspace "web\web-dashboard"

if (-not (Test-Path $dashboardPath)) {
    throw "Dashboard path not found: $dashboardPath"
}

Set-Location $dashboardPath

Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Starting Vite dev server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Dashboard will be available at:" -ForegroundColor Green
Write-Host "  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  http://localhost:5173/cwy-nin" -ForegroundColor Magenta
Write-Host ""

npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
