# 🎛️ Test Platform Control Center
# Quick test to verify all 7 services status

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "🎛️  Web8 Platform Control Center - Service Status Check" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

Write-Host "🚫 Running No Fake Data guard..." -ForegroundColor Yellow
python "scripts/no_fake_data_guard.py"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No Fake Data guard failed. Aborting platform checks." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "✅ No Fake Data guard passed" -ForegroundColor Green
Write-Host ""

# Define all 7 core services
$services = @(
    @{ Name = "💓 Cwy Nin Engine"; Port = 7500; Endpoint = "/api/v1/nin/current" },
    @{ Name = "🌊 Ocean Core"; Port = 7000; Endpoint = "/api/v1/health" },
    @{ Name = "🤖 ASI Agents"; Port = 7100; Endpoint = "/api/v1/health" },
    @{ Name = "🏘️  AI-v2 Neighborhood"; Port = 7200; Endpoint = "/api/v1/health" },
    @{ Name = "🧠 Euroweb AGI"; Port = 7300; Endpoint = "/api/v1/health" },
    @{ Name = "👷 Clisonix Labors"; Port = 7400; Endpoint = "/api/v1/health" },
    @{ Name = "🎛️  Orchestrator"; Port = 8000; Endpoint = "/api/v1/health" }
)

$onlineCount = 0
$totalCount = $services.Count

Write-Host "Checking all 7 core components..." -ForegroundColor Yellow
Write-Host ""

foreach ($service in $services) {
    $url = "http://localhost:$($service.Port)$($service.Endpoint)"
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 3 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ " -NoNewline -ForegroundColor Green
            Write-Host "$($service.Name) " -NoNewline
            Write-Host "(Port $($service.Port)) " -NoNewline -ForegroundColor Gray
            Write-Host "ONLINE" -ForegroundColor Green
            $onlineCount++
        } else {
            Write-Host "⚠️  " -NoNewline -ForegroundColor Yellow
            Write-Host "$($service.Name) " -NoNewline
            Write-Host "(Port $($service.Port)) " -NoNewline -ForegroundColor Gray
            Write-Host "DEGRADED" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ " -NoNewline -ForegroundColor Red
        Write-Host "$($service.Name) " -NoNewline
        Write-Host "(Port $($service.Port)) " -NoNewline -ForegroundColor Gray
        Write-Host "OFFLINE" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan

# Calculate health percentage
$healthPercentage = [math]::Round(($onlineCount / $totalCount) * 100, 1)

Write-Host "Platform Health: " -NoNewline
if ($healthPercentage -gt 70) {
    Write-Host "$healthPercentage% " -NoNewline -ForegroundColor Green
    Write-Host "($onlineCount/$totalCount services online)" -ForegroundColor Green
} elseif ($healthPercentage -gt 40) {
    Write-Host "$healthPercentage% " -NoNewline -ForegroundColor Yellow
    Write-Host "($onlineCount/$totalCount services online)" -ForegroundColor Yellow
} else {
    Write-Host "$healthPercentage% " -NoNewline -ForegroundColor Red
    Write-Host "($onlineCount/$totalCount services online)" -ForegroundColor Red
}

Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Show dashboard URL
Write-Host "📊 Dashboard: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:5173/platform" -ForegroundColor White
Write-Host ""

# Recommendations
if ($onlineCount -eq 0) {
    Write-Host "⚠️  No services are running!" -ForegroundColor Red
    Write-Host "   Run: " -NoNewline -ForegroundColor Yellow
    Write-Host ".\scripts\start-all.ps1" -ForegroundColor White
} elseif ($onlineCount -lt $totalCount) {
    Write-Host "💡 Some services are offline. To start all services:" -ForegroundColor Yellow
    Write-Host "   Run: " -NoNewline -ForegroundColor Yellow
    Write-Host ".\scripts\start-all.ps1" -ForegroundColor White
} else {
    Write-Host "🎉 All systems operational! Platform is fully online!" -ForegroundColor Green
}

Write-Host ""
