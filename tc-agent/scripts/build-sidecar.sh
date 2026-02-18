#!/bin/bash
set -euo pipefail

# Build tc-connector as a standalone binary using Bun's compile feature.
# The compiled binary is placed in src-tauri/binaries/ for Tauri to bundle.
#
# Tauri expects sidecar binaries named: <name>-<target-triple>
# e.g., tc-connector-aarch64-apple-darwin

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONNECTOR_DIR="$(dirname "$PROJECT_DIR")/tc-connector"
BINARIES_DIR="$PROJECT_DIR/src-tauri/binaries"

echo "=== Building tc-connector sidecar ==="
echo "Connector source: $CONNECTOR_DIR"
echo "Output directory: $BINARIES_DIR"
echo ""

# Check for bun
if ! command -v bun &> /dev/null; then
    echo "Error: bun is required but not installed."
    echo "Install: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Build TypeScript first
echo "Step 1: Compiling TypeScript..."
cd "$CONNECTOR_DIR"
npm run build

# Create output directory
mkdir -p "$BINARIES_DIR"

# Detect current platform
ARCH=$(uname -m)
OS=$(uname -s)

case "$OS" in
    Darwin)
        case "$ARCH" in
            arm64)
                TARGET="aarch64-apple-darwin"
                ;;
            x86_64)
                TARGET="x86_64-apple-darwin"
                ;;
            *)
                echo "Error: Unsupported architecture: $ARCH"
                exit 1
                ;;
        esac
        ;;
    Linux)
        case "$ARCH" in
            x86_64)
                TARGET="x86_64-unknown-linux-gnu"
                ;;
            aarch64)
                TARGET="aarch64-unknown-linux-gnu"
                ;;
            *)
                echo "Error: Unsupported architecture: $ARCH"
                exit 1
                ;;
        esac
        ;;
    MINGW*|MSYS*|CYGWIN*)
        TARGET="x86_64-pc-windows-msvc"
        ;;
    *)
        echo "Error: Unsupported OS: $OS"
        exit 1
        ;;
esac

OUTPUT_NAME="tc-connector-$TARGET"
OUTPUT_PATH="$BINARIES_DIR/$OUTPUT_NAME"

echo "Step 2: Compiling standalone binary for $TARGET..."
bun build "$CONNECTOR_DIR/dist/index.js" --compile --outfile "$OUTPUT_PATH"

# Make executable
chmod +x "$OUTPUT_PATH"

echo ""
echo "=== Sidecar built successfully ==="
echo "Binary: $OUTPUT_PATH"
echo "Size: $(du -h "$OUTPUT_PATH" | cut -f1)"
echo ""
echo "To build for cross-compilation targets, use Bun's --target flag:"
echo "  bun build dist/index.js --compile --target=bun-darwin-arm64 --outfile binaries/tc-connector-aarch64-apple-darwin"
echo "  bun build dist/index.js --compile --target=bun-darwin-x64 --outfile binaries/tc-connector-x86_64-apple-darwin"
echo "  bun build dist/index.js --compile --target=bun-windows-x64 --outfile binaries/tc-connector-x86_64-pc-windows-msvc.exe"
