$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path (Join-Path $root '.git'))) {
    Write-Error 'No .git directory found in this workspace. Initialize or clone as git repo first.'
    exit 1
}

git config core.hooksPath .githooks
Write-Host 'Configured core.hooksPath=.githooks' -ForegroundColor Green
Write-Host 'Pre-commit hook is now active.' -ForegroundColor Green
