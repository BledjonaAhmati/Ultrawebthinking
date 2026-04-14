# 🧪 Test All Services Script
# Tests each service individually before full stack start
# 
# Attribution: Alda (QA), Ageim (DevOps)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🧪 Testing All Services" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

# Track results
$testResults = @()

function Test-ServiceEndpoint {
    param(
        [string]$ServiceName,
        [string]$Url,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "🔍 Testing: $ServiceName" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "   ✅ $ServiceName is responding!" -ForegroundColor Green
            
            $testResults += @{
                Service = $ServiceName
                Status = "✅ Online"
                Url = $Url
            }
        } else {
            Write-Host "   ⚠️ Unexpected status: $($response.StatusCode)" -ForegroundColor Yellow
            
            $testResults += @{
                Service = $ServiceName
                Status = "⚠️ Unexpected Status"
                Url = $Url
            }
        }
    } catch {
        Write-Host "   ❌ $ServiceName is offline or not responding" -ForegroundColor Red
        
        $testResults += @{
            Service = $ServiceName
            Status = "❌ Offline"
            Url = $Url
        }
    }
    
    Write-Host ""
}

Write-Host "Testing Core AGI Services..." -ForegroundColor Cyan
Write-Host ""

Test-ServiceEndpoint "Ocean Core" "http://localhost:7000/api/v1/health"
Test-ServiceEndpoint "ASI Agents" "http://localhost:7100/api/v1/agents/health"
Test-ServiceEndpoint "AI V2 Neighborhood" "http://localhost:7200/api/v1/health"
Test-ServiceEndpoint "EuroWeb AGI" "http://localhost:7300/api/v1/health"
Test-ServiceEndpoint "Clisonix Labors" "http://localhost:7400/api/v1/labors/health"
Test-ServiceEndpoint "Cwy Nin Engine" "http://localhost:7500/api/v1/nin/current"
Test-ServiceEndpoint "Orchestrator" "http://localhost:8000/api/v1/health"

Write-Host "Testing Frontend..." -ForegroundColor Cyan
Write-Host ""

Test-ServiceEndpoint "Web Dashboard" "http://localhost:5173"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

foreach ($result in $testResults) {
    $statusColor = if ($result.Status -like "✅*") { "Green" } 
                   elseif ($result.Status -like "⚠️*") { "Yellow" }
                   else { "Red" }
    
    Write-Host "$($result.Status) $($result.Service)" -ForegroundColor $statusColor
    Write-Host "   $($result.Url)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan

$onlineCount = ($testResults | Where-Object { $_.Status -like "✅*" }).Count
$totalCount = $testResults.Count

Write-Host "✅ $onlineCount / $totalCount services online" -ForegroundColor Green
Write-Host ""

if ($onlineCount -eq $totalCount) {
    Write-Host "🎉 All services are online and responding!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Open http://localhost:5173/cwy-nin to see Cwy!" -ForegroundColor Yellow
} elseif ($onlineCount -eq 0) {
    Write-Host "⚠️ No services are running!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run: .\scripts\start-all.ps1" -ForegroundColor Yellow
} else {
    Write-Host "⚠️ Some services are offline" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check logs for offline services" -ForegroundColor Gray
}

Write-Host ""
