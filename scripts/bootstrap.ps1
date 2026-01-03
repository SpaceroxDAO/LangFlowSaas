# Bootstrap script - Initialize project from templates (Windows PowerShell)

Write-Host "🚀 Bootstrapping Claude Code Universal Starter..." -ForegroundColor Cyan
Write-Host ""

function Copy-IfNotExists {
    param($Source, $Dest)

    if (-not (Test-Path $Dest)) {
        Copy-Item $Source $Dest
        Write-Host "  ✅ Created $Dest" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Skipped $Dest (already exists)" -ForegroundColor Yellow
    }
}

Write-Host "📄 Setting up documentation..."
Copy-IfNotExists "docs/00_PROJECT_SPEC.template.md" "docs/00_PROJECT_SPEC.md"
Copy-IfNotExists "docs/01_ARCHITECTURE.template.md" "docs/01_ARCHITECTURE.md"
Copy-IfNotExists "docs/02_CHANGELOG.template.md" "docs/02_CHANGELOG.md"
Copy-IfNotExists "docs/03_STATUS.template.md" "docs/03_STATUS.md"

Write-Host ""
Write-Host "⚙️  Setting up configuration..."
Copy-IfNotExists ".claude/settings.local.json.example" ".claude/settings.local.json"

Write-Host ""
Write-Host "✨ Bootstrap complete!"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit docs/00_PROJECT_SPEC.md with your project details"
Write-Host "  2. Run: Copy-Item .env.example .env (and configure)"
Write-Host "  3. Install dependencies for your stack"
Write-Host "  4. Run: /ops/doctor to verify setup"
Write-Host ""
