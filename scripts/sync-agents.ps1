<#
.SYNOPSIS
    Synchronizes the agent configuration (Memory, Instructions, .opencode) from the central repository.
    - Inside a DevContainer: Syncs to the current directory (Project mode).
    - Outside (Host): Syncs to the global user config folder (~/.config/opencode).
    Does NOT require Git installed on the target machine.
#>
param(
    [string]$RepoOwner = "Autonomic-OpenCode",
    [string]$RepoName = "Autonomic-OpenCode-CLI",
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$TempDir = Join-Path $env:TEMP "agent-sync-$(Get-Random)"
$ZipPath = Join-Path $TempDir "repo.zip"

# Determine Target Directory and Mode
if ($env:REMOTE_CONTAINERS -eq "true" -or $env:CODESPACES -eq "true") {
    $TargetDir = Get-Location
    $IsGlobal = $false
    Write-Host "🐳 DevContainer detected. Syncing to PROJECT root: $TargetDir" -ForegroundColor Cyan
} else {
    # Global path: ~/.config/opencode (matches Linux/Mac structure)
    $TargetDir = Join-Path $env:USERPROFILE ".config\opencode"
    $IsGlobal = $true
    Write-Host "💻 Host environment detected. Syncing to GLOBAL config: $TargetDir" -ForegroundColor Cyan
    if (-not (Test-Path $TargetDir)) { New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null }
}

# GitHub Archive URL
$DownloadUrl = "https://github.com/$RepoOwner/$RepoName/archive/refs/heads/$Branch.zip"

Write-Host "🤖 Starting Agent Synchronization..." -ForegroundColor Cyan

try {
    # 1. Create Temp Dir
    New-Item -ItemType Directory -Force -Path $TempDir | Out-Null

    # 2. Download ZIP (No Git required)
    Write-Host "   📥 Downloading repository from GitHub (ZIP)..." -ForegroundColor Gray
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath

    # 3. Extract ZIP
    Write-Host "   📦 Extracting files..." -ForegroundColor Gray
    Expand-Archive -Path $ZipPath -DestinationPath $TempDir -Force

    $ExtractedRoot = Join-Path $TempDir "$RepoName-$Branch"

    # 4. Sync Files
    
    # 4a. Sync Root Files/Folders (instructions, opencode.jsonc)
    $RootItems = @("instructions", "opencode.jsonc")
    foreach ($item in $RootItems) {
        $SourcePath = Join-Path $ExtractedRoot $item
        $DestPath = Join-Path $TargetDir $item

        if (Test-Path $SourcePath) {
            Write-Host "   🔄 Updating $item..." -ForegroundColor Gray
            if ((Get-Item $SourcePath).PSIsContainer) {
                # Directory
                $robocopyArgs = @($SourcePath, $DestPath, "/E", "/XO", "/NFL", "/NDL")
                & robocopy $robocopyArgs | Out-Null
            } else {
                # File
                Copy-Item -Path $SourcePath -Destination $DestPath -Force
            }
        }
    }

    # 4b. Sync .opencode folder
    # If Global: Copy CONTENTS of .opencode to Target (Target IS the .opencode equivalent)
    # If Project: Copy .opencode FOLDER to Target
    
    $SourceOpencode = Join-Path $ExtractedRoot ".opencode"
    
    if ($IsGlobal) {
        # Global: .opencode/agent -> ~/.config/opencode/agent
        if (Test-Path $SourceOpencode) {
            Write-Host "   🔄 Updating global configuration..." -ForegroundColor Gray
            $robocopyArgs = @($SourceOpencode, $TargetDir, "/E", "/XO", "/NFL", "/NDL")
            & robocopy $robocopyArgs | Out-Null
        }
    } else {
        # Project: .opencode -> ./.opencode
        $DestOpencode = Join-Path $TargetDir ".opencode"
        if (Test-Path $SourceOpencode) {
            Write-Host "   🔄 Updating .opencode folder..." -ForegroundColor Gray
            $robocopyArgs = @($SourceOpencode, $DestOpencode, "/E", "/XO", "/NFL", "/NDL")
            & robocopy $robocopyArgs | Out-Null
        }
    }

    Write-Host "✅ Synchronization successful! Your agents are up to date." -ForegroundColor Green
}
catch {
    Write-Error "❌ Error: $_"
}
finally {
    # 5. Cleanup
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}
