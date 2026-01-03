# Doctor script (Windows PowerShell)

Write-Host "🏥 Claude Code Environment Doctor" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Claude Code structure
Write-Host "📁 Claude Code Structure"
if (Test-Path ".claude") {
    Write-Host "✅ .claude\ directory exists" -ForegroundColor Green
} else {
    Write-Host "❌ .claude\ directory missing" -ForegroundColor Red
}

if (Test-Path ".claude\settings.json") {
    Write-Host "✅ settings.json found" -ForegroundColor Green
} else {
    Write-Host "❌ settings.json missing" -ForegroundColor Red
}

Write-Host ""

# Check toolchains
Write-Host "🔧 Detected Toolchains"

if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
}

Write-Host ""

# MCP configuration
Write-Host "🔌 MCP Configuration"
if (Test-Path ".mcp.json") {
    Write-Host "✅ .mcp.json found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .mcp.json not found" -ForegroundColor Yellow
    Write-Host "   Run: /setup/mcp to configure"
}

Write-Host ""
Write-Host "✨ Doctor check complete!"
