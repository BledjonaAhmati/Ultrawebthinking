# GitHub SSH Key Setup Script
# Automates SSH key generation and configuration for GitHub
# Attribution: Ageim (DevOps)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "GitHub SSH Key Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"

$sshDir = "$env:USERPROFILE\.ssh"
$keyName = "id_ed25519"
$keyPath = "$sshDir\$keyName"
$pubKeyPath = "$keyPath.pub"

Write-Host "Checking for existing SSH keys..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path $pubKeyPath) {
    Write-Host "SSH key already exists at: $pubKeyPath" -ForegroundColor Yellow
    Write-Host ""
    
    $overwrite = Read-Host "Overwrite existing key? (yes/no)"
    
    if ($overwrite -ne "yes") {
        Write-Host ""
        Write-Host "Using existing SSH key" -ForegroundColor Green
        Write-Host ""
        Get-Content $pubKeyPath
        Write-Host ""
        Get-Content $pubKeyPath | Set-Clipboard
        Write-Host "Public key copied to clipboard!" -ForegroundColor Green
        Write-Host ""
        $skipGeneration = $true
    } else {
        $skipGeneration = $false
    }
} else {
    $skipGeneration = $false
}

if (-not $skipGeneration) {
    Write-Host "Enter your GitHub email address:" -ForegroundColor Yellow
    $email = Read-Host
    
    Write-Host ""
    Write-Host "Generating SSH key..." -ForegroundColor Yellow
    Write-Host ""
    
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
        Write-Host "Created .ssh directory" -ForegroundColor Green
    }
    
    $process = Start-Process -FilePath "ssh-keygen" -ArgumentList "-t", "ed25519", "-C", $email, "-f", $keyPath, "-N", "" -Wait -NoNewWindow -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "SSH key generated successfully!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "Failed to generate SSH key" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting SSH agent..." -ForegroundColor Yellow
Write-Host ""

try {
    $service = Get-Service ssh-agent -ErrorAction SilentlyContinue
    
    if ($service) {
        if ($service.Status -ne 'Running') {
            Set-Service -Name ssh-agent -StartupType Manual
            Start-Service ssh-agent
            Write-Host "SSH agent started" -ForegroundColor Green
        } else {
            Write-Host "SSH agent already running" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Could not start ssh-agent" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Adding SSH key to agent..." -ForegroundColor Yellow
Write-Host ""

try {
    & ssh-add $keyPath 2>&1 | Out-Null
    Write-Host "SSH key added to agent" -ForegroundColor Green
} catch {
    Write-Host "Could not add key to agent" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Your SSH Public Key" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$publicKey = Get-Content $pubKeyPath
Write-Host $publicKey -ForegroundColor Green
Write-Host ""

Get-Content $pubKeyPath | Set-Clipboard
Write-Host "Public key copied to clipboard!" -ForegroundColor Green
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Next Steps: Add to GitHub" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Go to: https://github.com/settings/keys" -ForegroundColor Yellow
Write-Host "2. Click 'New SSH key'" -ForegroundColor Yellow
Write-Host "3. Title: 'Web8 Dev Machine'" -ForegroundColor Yellow
Write-Host "4. Paste the key (already in clipboard)" -ForegroundColor Yellow
Write-Host "5. Click 'Add SSH key'" -ForegroundColor Yellow
Write-Host ""

$ready = Read-Host "Press Enter after adding the key to GitHub"

Write-Host ""
Write-Host "Testing GitHub SSH connection..." -ForegroundColor Yellow
Write-Host ""

try {
    $testResult = & ssh -T git@github.com 2>&1
    
    if ($testResult -like "*successfully authenticated*") {
        Write-Host "Successfully connected to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host $testResult -ForegroundColor Gray
    } else {
        Write-Host "Connection test result:" -ForegroundColor Yellow
        Write-Host $testResult -ForegroundColor Gray
    }
} catch {
    Write-Host "Connection test failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Update Git Remote (Optional)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$currentRemote = git remote get-url origin 2>$null

if ($currentRemote) {
    Write-Host "Current remote: $currentRemote" -ForegroundColor Gray
    Write-Host ""
    
    if ($currentRemote -like "https://*") {
        Write-Host "You're using HTTPS. Switch to SSH?" -ForegroundColor Yellow
        Write-Host ""
        
        $switchToSsh = Read-Host "Switch to SSH? (yes/no)"
        
        if ($switchToSsh -eq "yes") {
            if ($currentRemote -match "github\.com[:/](.+?)(?:\.git)?$") {
                $repoPath = $matches[1]
                $sshUrl = "git@github.com:$repoPath.git"
                
                Write-Host ""
                Write-Host "Updating remote to: $sshUrl" -ForegroundColor Yellow
                
                git remote set-url origin $sshUrl
                
                Write-Host "Remote updated to SSH!" -ForegroundColor Green
                Write-Host ""
                
                $newRemote = git remote get-url origin
                Write-Host "New remote: $newRemote" -ForegroundColor Green
            }
        }
    } elseif ($currentRemote -like "git@github.com:*") {
        Write-Host "Already using SSH remote" -ForegroundColor Green
    }
} else {
    Write-Host "No git remote configured" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "SSH Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "You can now use SSH to push/pull from GitHub" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Yellow
Write-Host "  git push origin master" -ForegroundColor Gray
Write-Host "  git pull origin master" -ForegroundColor Gray
Write-Host "  ssh -T git@github.com" -ForegroundColor Gray
Write-Host ""
