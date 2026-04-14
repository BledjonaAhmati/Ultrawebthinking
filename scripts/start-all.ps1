# 🚀 Start All Services Script
# Starts all AGI services + Dashboard in separate terminals
# 
# Attribution: Ageim (DevOps), Lagter (Integration)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting All Services" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspace = Split-Path -Parent $scriptRoot

$pythonCmd = if (Get-Command python -ErrorAction SilentlyContinue) {
    "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    "py -3.14"
} else {
    throw "Python was not found in PATH. Install Python 3.14+ or add it to PATH."
}

$shellExe = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh" } else { "powershell" }

# Service definitions
$services = @(
    @{
        Name = "Ocean Core"
        Path = "$workspace\core\clisonix-ocean-core"
        Command = "$pythonCmd ocean_core.py"
        Port = 7000
        Color = "Blue"
    },
    @{
        Name = "ASI Agents"
        Path = "$workspace\core\asi-agents"
        Command = "$pythonCmd agents_registry.py"
        Port = 7100
        Color = "Green"
    },
    @{
        Name = "AI V2 Neighborhood"
        Path = "$workspace\core\ai-v2-neighborhood"
        Command = "$pythonCmd model_orchestration.py"
        Port = 7200
        Color = "Cyan"
    },
    @{
        Name = "EuroWeb AGI"
        Path = "$workspace\core\euroweb-agi"
        Command = "$pythonCmd thinking_engine.py"
        Port = 7300
        Color = "Magenta"
    },
    @{
        Name = "Clisonix Labors"
        Path = "$workspace\core\clisonix-labors"
        Command = "$pythonCmd labor_units.py"
        Port = 7400
        Color = "Yellow"
    },
    @{
        Name = "Cwy Nin Engine"
        Path = "$workspace\core\cwy-nin-engine"
        Command = "$pythonCmd nin_core.py"
        Port = 7500
        Color = "Red"
    },
    @{
        Name = "Orchestrator"
        Path = "$workspace\core\orchestrator"
        Command = "$pythonCmd main.py"
        Port = 8000
        Color = "White"
    },
    @{
        Name = "Web Dashboard"
        Path = "$workspace\web\web-dashboard"
        Command = "npm run dev"
        Port = 5173
        Color = "DarkCyan"
    }
)

Write-Host "Starting $($services.Count) services..." -ForegroundColor Yellow
Write-Host ""

foreach ($service in $services) {
    Write-Host "🚀 Starting: $($service.Name)" -ForegroundColor $service.Color
    Write-Host "   Path: $($service.Path)" -ForegroundColor Gray
    Write-Host "   Port: $($service.Port)" -ForegroundColor Gray
    
    if (-not (Test-Path $service.Path)) {
        Write-Host "   ❌ Missing path: $($service.Path)" -ForegroundColor Red
        Write-Host ""
        continue
    }

    # Start in new terminal
    Start-Process $shellExe -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$($service.Path)'; Write-Host '============================================================' -ForegroundColor $($service.Color); Write-Host '$($service.Name) - Port $($service.Port)' -ForegroundColor $($service.Color); Write-Host '============================================================' -ForegroundColor $($service.Color); $($service.Command)"
    )
    
    # Small delay between starts
    Start-Sleep -Seconds 2
    
    Write-Host "   ✅ Terminal opened for $($service.Name)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "All Services Starting..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⏳ Waiting 15 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "🧪 Testing service availability..." -ForegroundColor Yellow
Write-Host ""

# Test each service
foreach ($service in $services) {
    $url = "http://localhost:$($service.Port)"
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 3 -ErrorAction Stop
        Write-Host "✅ $($service.Name) is online!" -ForegroundColor Green
    } catch {
        Write-Host "⏳ $($service.Name) still starting..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Service URLs" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Core Services:" -ForegroundColor Yellow
Write-Host "  Ocean Core:        http://localhost:7000/docs" -ForegroundColor Gray
Write-Host "  ASI Agents:        http://localhost:7100/docs" -ForegroundColor Gray
Write-Host "  AI V2:             http://localhost:7200/docs" -ForegroundColor Gray
Write-Host "  EuroWeb AGI:       http://localhost:7300/docs" -ForegroundColor Gray
Write-Host "  Clisonix Labors:   http://localhost:7400/docs" -ForegroundColor Gray
Write-Host "  Cwy Nin Engine:    http://localhost:7500/docs" -ForegroundColor Gray
Write-Host "  Orchestrator:      http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "Dashboard:" -ForegroundColor Yellow
Write-Host "  Web Dashboard:     http://localhost:5173" -ForegroundColor Gray
Write-Host "  Cwy Nin Monitor:   http://localhost:5173/cwy-nin" -ForegroundColor Magenta
Write-Host "  Cwy Advanced:      http://localhost:5173/cwy" -ForegroundColor Magenta
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🎉 All Services Started!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Open: http://localhost:5173/cwy-nin" -ForegroundColor Cyan
Write-Host "  2. Watch Cwy's emotions in real-time!" -ForegroundColor Cyan
Write-Host "  3. Run: .\scripts\test-all.ps1 to verify all services" -ForegroundColor Cyan
Write-Host ""
