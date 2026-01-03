# Smoke test script (Windows PowerShell)

Write-Host "🧪 Running Smoke Tests" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

$Failed = 0
$Passed = 0

function Test-Pass {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
    $script:Passed++
}

function Test-Fail {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    $script:Failed++
}

# Test directory structure
Write-Host "📁 Testing directory structure..."
if (Test-Path ".claude") { Test-Pass ".claude\ exists" } else { Test-Fail ".claude\ missing" }
if (Test-Path "docs") { Test-Pass "docs\ exists" } else { Test-Fail "docs\ missing" }
if (Test-Path "scripts") { Test-Pass "scripts\ exists" } else { Test-Fail "scripts\ missing" }
if (Test-Path "packs") { Test-Pass "packs\ exists" } else { Test-Fail "packs\ missing" }
Write-Host ""

# Test required files
Write-Host "📄 Testing required files..."
if (Test-Path ".gitignore") { Test-Pass ".gitignore exists" } else { Test-Fail ".gitignore missing" }
if (Test-Path "upstreams.lock.json") { Test-Pass "upstreams.lock.json exists" } else { Test-Fail "upstreams.lock.json missing" }
if (Test-Path ".claude\settings.json") { Test-Pass ".claude\settings.json exists" } else { Test-Fail ".claude\settings.json missing" }
Write-Host ""

# Summary
Write-Host "📊 Test Summary"
Write-Host "==============="
Write-Host "Passed: $Passed"
Write-Host "Failed: $Failed"
Write-Host ""

if ($Failed -eq 0) {
    Write-Host "✨ All smoke tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Some tests failed." -ForegroundColor Red
    exit 1
}
