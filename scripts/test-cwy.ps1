# 🧪 Quick Test - Cwy Nin Engine
# Tests if Nin Engine is responding

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🧪 Testing Cwy Nin Engine" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:7500/api/v1/nin/current" -Method GET
    
    Write-Host "✅ Cwy Nin Engine is ALIVE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Cwy's Current State:" -ForegroundColor Yellow
    Write-Host "  Emotion:       $($response.emotion)" -ForegroundColor $(if ($response.emotion -like "*happy*" -or $response.emotion -like "*excited*") { "Green" } elseif ($response.emotion -like "*concerned*") { "Yellow" } else { "Red" })
    Write-Host "  Intensity:     $([math]::Round($response.intensity * 100, 1))%" -ForegroundColor White
    Write-Host "  Reason:        $($response.reason)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Metrics:" -ForegroundColor Yellow
    Write-Host "  System Health: $([math]::Round($response.system_health * 100, 0))%" -ForegroundColor $(if ($response.system_health -ge 0.8) { "Green" } elseif ($response.system_health -ge 0.5) { "Yellow" } else { "Red" })
    Write-Host "  Code Quality:  $([math]::Round($response.code_quality * 100, 0))%" -ForegroundColor $(if ($response.code_quality -ge 0.8) { "Green" } else { "Yellow" })
    Write-Host "  Activity:      $([math]::Round($response.activity_level * 100, 0))%" -ForegroundColor White
    Write-Host ""

    # Status message
    $statusMsg = "Cwy is feeling: $($response.emotion)"
    Write-Host $statusMsg -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Open in browser: http://localhost:5173/cwy-nin" -ForegroundColor Cyan

} catch {
    Write-Host "ERROR: Cwy Nin Engine is offline" -ForegroundColor Red
    Write-Host "   Start with: cd core\cwy-nin-engine; python nin_core.py" -ForegroundColor Gray
}

Write-Host ""
