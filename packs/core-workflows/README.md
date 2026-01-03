# Core Workflows Pack

PSB (Plan-Setup-Build) workflow integration and structured development workflows.

## What This Adds

- Workflow initialization commands
- PSB workflow tracking
- Project template management
- Retro-style improvement skill (inspired by compound-engineering)

## Installation

```bash
./scripts/enable-pack.sh core-workflows
```

## Commands Added

- `/workflow-init` - Initialize PSB workflow for current project
- `/workflow-status` - Check current workflow phase and progress

## Usage

After enabling this pack, initialize your project workflow:

```bash
/workflow-init
```

Follow the PSB pattern documented in `docs/WORKFLOWS.md`.

## Adapted From

- compound-engineering-plugin: Workflow patterns
- claude-starter-kit: Project structure templates

See `upstreams.lock.json` for exact commit references.
