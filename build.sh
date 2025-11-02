#!/bin/bash

# Script to build MkDocs site
# Usage: ./build.sh

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$PROJECT_DIR/.venv"

echo "🏗️  Building MkDocs Site..."
echo "📂 Project: $PROJECT_DIR"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo "⚠️  Virtual environment not found. Creating..."
    python3 -m venv "$VENV_DIR"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        exit 1
    fi
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
if [ -f "$VENV_DIR/bin/activate" ]; then
    source "$VENV_DIR/bin/activate"
else
    echo "❌ Virtual environment activation script not found"
    echo "Trying to recreate virtual environment..."
    rm -rf "$VENV_DIR"
    python3 -m venv "$VENV_DIR"
    source "$VENV_DIR/bin/activate"
fi

# Check if mkdocs is installed
if ! command -v mkdocs &> /dev/null; then
    echo "📦 Installing MkDocs and dependencies..."
    pip install --upgrade pip
    pip install mkdocs mkdocs-material pymdown-extensions
    echo "✅ Dependencies installed"
fi

# Build site
echo "🔨 Building site..."
mkdocs build --clean

echo ""
echo "✅ Build complete!"
echo "📁 Output directory: $PROJECT_DIR/site"
