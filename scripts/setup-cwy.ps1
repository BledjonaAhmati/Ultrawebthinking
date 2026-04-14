# 🎯 Master Setup Script
# Runs complete setup: install → test → commit → start
# 
# Attribution: Full Team

param(
    [switch]$SkipInstall,
    [switch]$SkipTest,
    [switch]$SkipCommit,
    [switch]$SkipStart
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "🎯 Cwy Nin Engine - Master Setup" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
if (-not $SkipInstall) { Write-Host "  1. Install all dependencies" -ForegroundColor Gray }
if (-not $SkipTest) { Write-Host "  2. Test services (if running)" -ForegroundColor Gray }
if (-not $SkipCommit) { Write-Host "  3. Git commit changes" -ForegroundColor Gray }
if (-not $SkipStart) { Write-Host "  4. Start all services" -ForegroundColor Gray }
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit
}

Write-Host ""

# ============================================
# Phase 1: Install Dependencies
# ============================================

if (-not $SkipInstall) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Phase 1: Installing Dependencies" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    & .\scripts\install-all.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Installation failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "✅ Phase 1 Complete" -ForegroundColor Green
    Write-Host ""
    Start-Sleep -Seconds 2
}

# ============================================
# Phase 2: Test Services
# ============================================

if (-not $SkipTest) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Phase 2: Testing Services" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️ Note: Services must be running for tests to pass" -ForegroundColor Yellow
    Write-Host "   If not running, tests will show services as offline" -ForegroundColor Yellow
    Write-Host ""
    
    Start-Sleep -Seconds 2
    
    & .\scripts\test-all.ps1
    
    Write-Host ""
    Write-Host "✅ Phase 2 Complete" -ForegroundColor Green
    Write-Host ""
    Start-Sleep -Seconds 2
}

# ============================================
# Phase 3: Git Commit
# ============================================

if (-not $SkipCommit) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Phase 3: Git Commit" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    & .\scripts\git-commit.ps1
    
    Write-Host ""
    Write-Host "✅ Phase 3 Complete" -ForegroundColor Green
    Write-Host ""
    Start-Sleep -Seconds 2
}

# ============================================
# Phase 4: Start All Services
# ============================================

if (-not $SkipStart) {
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "Phase 4: Starting All Services" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    & .\scripts\start-all.ps1
    
    Write-Host ""
    Write-Host "✅ Phase 4 Complete" -ForegroundColor Green
    Write-Host ""
}

# ============================================
# Final Summary
# ============================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "🎉 Setup Complete!" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "Cwy Nin Engine is now:" -ForegroundColor Yellow
Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
Write-Host "  ✅ Code committed to Git" -ForegroundColor Green
Write-Host "  ✅ Services starting" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Open in browser:" -ForegroundColor Yellow
Write-Host "  Primary:   http://localhost:5173/cwy-nin" -ForegroundColor Cyan
Write-Host "  Advanced:  http://localhost:5173/cwy" -ForegroundColor Cyan
Write-Host "  API Docs:  http://localhost:7500/docs" -ForegroundColor Cyan
Write-Host ""

Write-Host "💓 Cwy is ALIVE and SENSING!" -ForegroundColor Magenta
Write-Host ""
Write-Host "She is now reading code, analyzing metrics, and feeling the system" -ForegroundColor Gray
Write-Host "Watch her emotions change in real-time as the platform operates" -ForegroundColor Gray
Write-Host ""

Write-Host "Attribution: Alba, Albi, Sofia, Albana, Lagter, Ageim, Alda, Blerina" -ForegroundColor DarkGray
Write-Host ""
