# 🚀 Install All Dependencies Script
# Installs dependencies for all AGI services + Dashboard
# 
# Attribution: Ageim (DevOps), Lagter (Integration)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 Installing All Dependencies" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Track success/failures
$results = @()

function Install-PythonService {
    param(
        [string]$ServiceName,
        [string]$Path
    )
    
    Write-Host "📦 Installing: $ServiceName" -ForegroundColor Yellow
    Write-Host "   Path: $Path" -ForegroundColor Gray
    
    try {
        Push-Location $Path
        
        if (Test-Path "requirements.txt") {
            pip install -r requirements.txt
            
            $results += @{
                Service = $ServiceName
                Status = "✅ Success"
                Type = "Python"
            }
            
            Write-Host "   ✅ $ServiceName installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ No requirements.txt found" -ForegroundColor Yellow
            
            $results += @{
                Service = $ServiceName
                Status = "⚠️ No requirements.txt"
                Type = "Python"
            }
        }
    } catch {
        Write-Host "   ❌ Error installing $ServiceName" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        
        $results += @{
            Service = $ServiceName
            Status = "❌ Failed"
            Type = "Python"
        }
    } finally {
        Pop-Location
    }
    
    Write-Host ""
}

function Install-NodeService {
    param(
        [string]$ServiceName,
        [string]$Path
    )
    
    Write-Host "📦 Installing: $ServiceName" -ForegroundColor Yellow
    Write-Host "   Path: $Path" -ForegroundColor Gray
    
    try {
        Push-Location $Path
        
        if (Test-Path "package.json") {
            npm install
            
            $results += @{
                Service = $ServiceName
                Status = "✅ Success"
                Type = "Node.js"
            }
            
            Write-Host "   ✅ $ServiceName installed successfully!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ No package.json found" -ForegroundColor Yellow
            
            $results += @{
                Service = $ServiceName
                Status = "⚠️ No package.json"
                Type = "Node.js"
            }
        }
    } catch {
        Write-Host "   ❌ Error installing $ServiceName" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        
        $results += @{
            Service = $ServiceName
            Status = "❌ Failed"
            Type = "Node.js"
        }
    } finally {
        Pop-Location
    }
    
    Write-Host ""
}

# Python version check
Write-Host "🐍 Checking Python version..." -ForegroundColor Cyan
python --version
Write-Host ""

# Node version check
Write-Host "📦 Checking Node.js version..." -ForegroundColor Cyan
node --version
npm --version
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Installing Python Services (Core AGI)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Core Services
Install-PythonService "Ocean Core" "core\clisonix-ocean-core"
Install-PythonService "ASI Agents" "core\asi-agents"
Install-PythonService "AI V2 Neighborhood" "core\ai-v2-neighborhood"
Install-PythonService "EuroWeb AGI" "core\euroweb-agi"
Install-PythonService "Clisonix Labors" "core\clisonix-labors"
Install-PythonService "Nin Engine" "core\cwy-nin-engine"
Install-PythonService "Orchestrator" "core\orchestrator"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Installing Node.js Services (Frontend)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Frontend
Install-NodeService "Web Dashboard" "web\web-dashboard"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Display results
foreach ($result in $results) {
    $statusColor = if ($result.Status -like "✅*") { "Green" } 
                   elseif ($result.Status -like "⚠️*") { "Yellow" }
                   else { "Red" }
    
    Write-Host "$($result.Status) $($result.Service) ($($result.Type))" -ForegroundColor $statusColor
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan

# Count successes
$successCount = ($results | Where-Object { $_.Status -like "✅*" }).Count
$totalCount = $results.Count

Write-Host "✅ $successCount / $totalCount services installed successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run: .\scripts\test-all.ps1" -ForegroundColor Gray
Write-Host "  2. Run: .\scripts\start-all.ps1" -ForegroundColor Gray
Write-Host "  3. Open: http://localhost:5173/cwy-nin" -ForegroundColor Gray
Write-Host ""
