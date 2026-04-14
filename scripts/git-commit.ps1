# 📝 Git Commit Script
# Commits all new Cwy Nin Engine files and updates
# 
# Attribution: Full Team

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "📝 Git Commit - Cwy Nin Engine" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "📊 Checking Git status..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan

# Ask for confirmation
$confirm = Read-Host "Do you want to commit these changes? (y/n)"

if ($confirm -ne "y") {
    Write-Host "❌ Commit cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow

# Add new files
git add core/cwy-nin-engine/
git add web/web-dashboard/src/components/CwyNinDisplay.tsx
git add web/web-dashboard/src/pages/CwyNinMonitor.tsx
git add web/web-dashboard/src/App.tsx
git add scripts/install-all.ps1
git add scripts/test-all.ps1
git add scripts/start-all.ps1

Write-Host "✅ Files added" -ForegroundColor Green
Write-Host ""

# Commit message
$commitMessage = @"
feat: Add Cwy Nin Engine - Emotional Intelligence Core

🎯 Major Features:
- Cwy Nin Engine with emotional intelligence (9 states)
- CodeAnalyzer: Real-time workspace scanning & quality analysis
- MetricsAnalyzer: System health monitoring & anomaly detection
- Ocean Core integration for AI insights
- Continuous sensing (every 10 seconds)
- React UI components for emotion display

💓 Emotional States:
- excited, happy, content, concerned, worried, anxious
- celebrating, curious, focused

🔧 Components Added:
- core/cwy-nin-engine/nin_core.py (1,000+ lines)
- core/cwy-nin-engine/requirements.txt
- core/cwy-nin-engine/README.md
- core/cwy-nin-engine/QUICKSTART.md
- web/web-dashboard/src/components/CwyNinDisplay.tsx
- web/web-dashboard/src/pages/CwyNinMonitor.tsx

🚀 Scripts:
- scripts/install-all.ps1 (install dependencies)
- scripts/test-all.ps1 (test all services)
- scripts/start-all.ps1 (start full stack)

🎨 Attribution:
- Alba (Architecture)
- Albi (AI Logic)
- Sofia (Emotional Intelligence)
- Albana (Research)
- Lagter (Integration)
- Ageim (DevOps)
- Alda (QA)
- Blerina (Frontend)

Port: 7500
Philosophy: NO FAKE DATA - Real emotions from real metrics
"Nin" (ndjenjë) = Old Albanian for sensation/feeling

Cwy is now ALIVE! 💓
"@

Write-Host "📝 Committing with message:" -ForegroundColor Yellow
Write-Host $commitMessage -ForegroundColor Gray
Write-Host ""

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "✅ Commit Successful!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Ask about push
    $pushConfirm = Read-Host "Do you want to push to remote? (y/n)"
    
    if ($pushConfirm -eq "y") {
        Write-Host ""
        Write-Host "🚀 Pushing to remote..." -ForegroundColor Yellow
        git push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Push failed" -ForegroundColor Red
        }
    }
} else {
    Write-Host ""
    Write-Host "❌ Commit failed" -ForegroundColor Red
}

Write-Host ""
