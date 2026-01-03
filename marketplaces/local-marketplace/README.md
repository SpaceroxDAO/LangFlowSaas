# Local Marketplace

A local plugin marketplace for Claude Code Universal Starter.

## Available Plugins

- **core-workflows**: PSB workflow integration
- **lsp-pack**: Language Server Protocol templates

## Usage

### Add Marketplace

```bash
claude plugins add-marketplace ./marketplaces/local-marketplace
```

### Install Plugins

```bash
# List available plugins
claude plugins search

# Install a plugin
claude plugins install core-workflows

# List installed plugins
claude plugins list
```

### Update Plugins

```bash
# Update specific plugin
claude plugins update core-workflows

# Update all
claude plugins update-all
```

## Adding New Plugins

1. Create plugin directory in `plugins/`
2. Add `.claude-plugin/plugin.json` manifest
3. Add plugin content in `.claude/` directory
4. Update `marketplace.json` to list the plugin

See `docs/PLUGINS_AND_PACKS.md` for detailed instructions.
