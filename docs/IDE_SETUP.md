# IDE Setup Guide

Recommendations for configuring your development environment with this Claude Code starter.

## VS Code (Recommended)

### Required Extensions

#### Claude Code Extension
The official Claude Code extension for VS Code integration.

**Install**:
```bash
code --install-extension anthropics.claude-code
```

**Or**: Search "Claude Code" in VS Code Extensions marketplace

### Recommended Extensions

#### Language-Specific

**JavaScript/TypeScript**:
- `dbaeumer.vscode-eslint` - ESLint
- `esbenp.prettier-vscode` - Prettier
- `ms-vscode.vscode-typescript-next` - TypeScript

**Python**:
- `ms-python.python` - Python support
- `ms-python.vscode-pylance` - Type checking
- `ms-python.black-formatter` - Black formatter
- `charliermarsh.ruff` - Ruff linter

**Go**:
- `golang.go` - Go support

**Rust**:
- `rust-lang.rust-analyzer` - Rust support

#### General Development
- `eamodio.gitlens` - Advanced Git features
- `streetsidesoftware.code-spell-checker` - Spell checking
- `editorconfig.editorconfig` - EditorConfig support

#### Optional but Useful
- `github.copilot` - AI pair programming (compatible with Claude Code)
- `ms-vscode-remote.remote-ssh` - Remote development
- `ms-vscode.live-server` - Live preview for web development

### Workspace Settings

Create `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "anthropics.claude-code",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "eamodio.gitlens"
  ]
}
```

This file is already included in the starter at:
```bash
.vscode/extensions.json
```

### User Settings
Recommended settings for Claude Code integration:

**File**: `.vscode/settings.json` (workspace-specific)
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/__pycache__": true,
    "**/node_modules": true,
    "**/.venv": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.venv": true,
    "**/.git": true
  },
  "claude.code.autoFormat": false,
  "claude.code.strictHooks": false
}
```

### Keyboard Shortcuts
Recommended shortcuts for Claude Code:

**File**: `.vscode/keybindings.json`
```json
[
  {
    "key": "cmd+shift+c cmd+shift+c",
    "command": "claude.code.chat"
  },
  {
    "key": "cmd+shift+c cmd+shift+d",
    "command": "claude.code.doctor"
  }
]
```

---

## Cursor IDE

Cursor has built-in Claude integration and works well with this starter.

### Setup
1. Open project in Cursor
2. Claude Code settings are automatically detected
3. Use `Cmd+K` or `Cmd+L` for Claude features

### Cursor-Specific Settings
**File**: `.cursor/settings.json`
```json
{
  "cursor.aiModels": {
    "codeModel": "claude-sonnet-4.5",
    "chatModel": "claude-sonnet-4.5"
  }
}
```

---

## JetBrains IDEs (IntelliJ, PyCharm, WebStorm)

### Claude Code Plugin
Available for JetBrains IDEs:
1. Go to Settings → Plugins
2. Search "Claude Code"
3. Install and restart

### Alternative: External Tools
Set up Claude Code as external tool:

**Settings → Tools → External Tools → Add**:
- Name: `Claude Code`
- Program: `claude`
- Arguments: `code $FilePath$`
- Working directory: `$ProjectFileDir$`

### Recommended Plugins
- **GitToolBox** - Git integration
- **Rainbow Brackets** - Better bracket matching
- **Key Promoter X** - Learn shortcuts

---

## Vim/Neovim

### Using with Vim
Add to `.vimrc` or `init.vim`:
```vim
" Open current file with Claude Code
nnoremap <leader>cc :!claude code %:p<CR>

" Open project with Claude Code
nnoremap <leader>cp :!claude code .<CR>
```

### Neovim Integration
For better integration, use a terminal multiplexer like `tmux`:

**~/.tmux.conf**:
```bash
# Split and run Claude Code
bind-key C split-window -h "claude code"
```

---

## Terminal Setup

### Shell Aliases
Add to `~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`:

**Bash/Zsh**:
```bash
# Quick Claude Code commands
alias cc="claude code"
alias ccr="claude code --resume"
alias ccd="claude code /ops/doctor"

# Project-specific
alias ccp="cd ~/projects && claude code"
```

**Fish**:
```fish
abbr cc 'claude code'
abbr ccr 'claude code --resume'
abbr ccd 'claude code /ops/doctor'
```

### Enhanced Terminal Experience
Use a modern terminal emulator:
- **iTerm2** (macOS)
- **Windows Terminal** (Windows)
- **Alacritty** (Cross-platform)
- **WezTerm** (Cross-platform)

---

## Git Configuration

### Recommended Git Settings
```bash
# Better diffs
git config --global diff.algorithm histogram

# Reuse recorded merge conflict resolutions
git config --global rerere.enabled true

# Default branch
git config --global init.defaultBranch main

# Editor
git config --global core.editor "code --wait"
```

### Git Hooks Integration
This starter's hooks work alongside git hooks:

**.git/hooks/pre-commit** (if you want git-level hooks too):
```bash
#!/bin/bash
# Run Claude Code hooks
./.claude/hooks/pre-commit.sh
```

---

## EditorConfig

The starter includes `.editorconfig` for consistent formatting:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx,json,css,scss,md}]
indent_style = space
indent_size = 2

[*.{py}]
indent_style = space
indent_size = 4

[*.{go}]
indent_style = tab

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

---

## Debugger Integration

### VS Code Debugging
**File**: `.vscode/launch.json`

**Node.js/TypeScript**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

**Python**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Language-Specific Setup

### Node.js Projects
```bash
# Install dependencies
npm install

# Set up git hooks (if using husky)
npm run prepare

# Verify setup
/ops/doctor
```

**.vscode/settings.json additions**:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Python Projects
```bash
# Create virtual environment
python -m venv .venv

# Activate
source .venv/bin/activate  # or `.venv/Scripts/activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Verify
/ops/doctor
```

**.vscode/settings.json additions**:
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.ruffEnabled": true
}
```

### Go Projects
```bash
# Initialize module
go mod init project-name

# Download dependencies
go mod download

# Verify
/ops/doctor
```

**.vscode/settings.json additions**:
```json
{
  "go.useLanguageServer": true,
  "go.formatTool": "gofmt",
  "go.lintTool": "golangci-lint"
}
```

---

## Remote Development

### VS Code Remote SSH
1. Install "Remote - SSH" extension
2. Connect to remote machine
3. Open project folder
4. Claude Code works over SSH

### GitHub Codespaces
This starter works in Codespaces:

**.devcontainer/devcontainer.json**:
```json
{
  "name": "Project Dev Container",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:18",
  "customizations": {
    "vscode": {
      "extensions": [
        "anthropics.claude-code",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "postCreateCommand": "npm install"
}
```

---

## Docker Integration

### VS Code Dev Containers
Use dev containers for consistent environments:

**.devcontainer/devcontainer.json**:
```json
{
  "name": "My Project",
  "dockerComposeFile": "docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "customizations": {
    "vscode": {
      "extensions": ["anthropics.claude-code"]
    }
  }
}
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  app:
    build: .
    volumes:
      - .:/workspace:cached
    command: sleep infinity
```

---

## Multi-Root Workspaces

For managing multiple related projects:

**my-workspace.code-workspace**:
```json
{
  "folders": [
    {
      "path": "frontend",
      "name": "Frontend"
    },
    {
      "path": "backend",
      "name": "Backend"
    }
  ],
  "settings": {
    "claude.code.strictHooks": false
  }
}
```

---

## Performance Optimization

### Large Project Settings
For better performance on large codebases:

**.vscode/settings.json**:
```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/objects/**": true,
    "**/dist/**": true,
    "**/.venv/**": true
  },
  "search.followSymlinks": false,
  "typescript.tsserver.maxTsServerMemory": 4096
}
```

### Exclude from Indexing
Add to `.gitignore` and IDE exclude patterns:
```
dist/
build/
.next/
coverage/
*.log
```

---

## Troubleshooting

### Claude Code Not Detected
1. Check extension is installed
2. Reload VS Code window
3. Check `.claude/` folder exists
4. Run `/ops/doctor`

### Formatting Conflicts
If auto-format fights between IDE and hooks:
```json
{
  "editor.formatOnSave": false,
  "claude.code.autoFormat": false
}
```

Choose one source of formatting.

### Slow IDE
1. Disable unused extensions
2. Exclude large folders from search
3. Increase memory limits
4. Use workspace instead of multi-root when possible

---

## Best Practices

### Do's
- ✅ Commit `.vscode/extensions.json` for team consistency
- ✅ Use workspace settings over user settings for projects
- ✅ Keep IDE-specific files minimal
- ✅ Document required extensions in README

### Don'ts
- ❌ Don't commit `.vscode/settings.json` with personal preferences
- ❌ Don't require expensive extensions
- ❌ Don't hard-code paths in settings
- ❌ Don't assume everyone uses the same IDE

---

## Related

- See `docs/WORKFLOWS.md` for development workflows
- See `docs/PERMISSIONS_AND_HOOKS.md` for hook configuration
- See `docs/PLUGINS_AND_PACKS.md` for extending functionality
