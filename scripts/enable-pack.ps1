# Enable pack script (Windows PowerShell)
param(
    [Parameter(Mandatory=$false)]
    [string]$PackName
)

if (-not $PackName) {
    Write-Host "Usage: .\scripts\enable-pack.ps1 <pack-name>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available packs:"
    Get-ChildItem -Path "packs" -Directory | ForEach-Object {
        Write-Host "  - $($_.Name)"
    }
    exit 1
}

$PackDir = "packs\$PackName"

if (-not (Test-Path $PackDir)) {
    Write-Host "❌ Pack '$PackName' not found in packs\" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$PackDir\.claude")) {
    Write-Host "❌ Pack '$PackName' has no .claude\ directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Enabling pack: $PackName" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Copying pack files..."
Copy-Item -Path "$PackDir\.claude\*" -Destination ".claude\" -Recurse -Force

Write-Host "✅ Pack '$PackName' enabled successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Run '/ops/doctor' to verify the installation."
