#!/bin/bash
# sync-agents.sh - Synchronizes agent configurations for Linux & Mac
# - Inside DevContainer: Syncs to current directory (Project mode)
# - Outside: Syncs to ~/.config/opencode (Global mode)
# Does NOT require Git. Uses curl/wget and tar.

REPO_OWNER="Autonomic-OpenCode"
REPO_NAME="Autonomic-OpenCode-CLI"
BRANCH="more-agents"

# GitHub Tarball URL
DOWNLOAD_URL="https://github.com/$REPO_OWNER/$REPO_NAME/archive/refs/heads/$BRANCH.tar.gz"

# Determine Target Directory and Mode
if [ "$REMOTE_CONTAINERS" = "true" ] || [ "$CODESPACES" = "true" ]; then
    TARGET_DIR="."
    IS_GLOBAL=false
    echo "🐳 DevContainer detected. Syncing to PROJECT root."
else
    TARGET_DIR="$HOME/.config/opencode"
    IS_GLOBAL=true
    echo "💻 Host environment detected. Syncing to GLOBAL config: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Use mktemp for a secure temp directory
TEMP_DIR=$(mktemp -d)
TAR_PATH="$TEMP_DIR/repo.tar.gz"

echo "🤖 Starting Agent Synchronization..."

# 1. Download
echo "   📥 Downloading repository from GitHub (Tarball)..."
if command -v curl &> /dev/null; then
    curl -L -s -o "$TAR_PATH" "$DOWNLOAD_URL"
elif command -v wget &> /dev/null; then
    wget -q -O "$TAR_PATH" "$DOWNLOAD_URL"
else
    echo "❌ Error: Neither curl nor wget found. Please install one of them."
    exit 1
fi

# 2. Extract
echo "   📦 Extracting files..."
tar -xzf "$TAR_PATH" -C "$TEMP_DIR"
EXTRACTED_ROOT="$TEMP_DIR/$REPO_NAME-$BRANCH"

# 3. Sync Function
sync_item() {
    local source=$1
    local dest=$2
    
    if [ -e "$source" ]; then
        echo "   🔄 Updating $(basename "$source")..."
        
        # If directory, ensure dest exists
        if [ -d "$source" ]; then
            mkdir -p "$dest"
            # rsync if available
            if command -v rsync &> /dev/null; then
                rsync -au "$source/" "$dest/"
            else
                cp -ru "$source/"* "$dest/"
            fi
        else
            # File
            cp -f "$source" "$dest"
        fi
    fi
}

# 4. Sync Root Items
sync_item "$EXTRACTED_ROOT/instructions" "$TARGET_DIR/instructions"
sync_item "$EXTRACTED_ROOT/opencode.jsonc" "$TARGET_DIR/opencode.jsonc"

# 5. Sync .opencode folder
SOURCE_OPENCODE="$EXTRACTED_ROOT/.opencode"

if [ "$IS_GLOBAL" = true ]; then
    # Global: Copy CONTENTS of .opencode to ~/.config/opencode
    # e.g. .opencode/agent -> ~/.config/opencode/agent
    if [ -d "$SOURCE_OPENCODE" ]; then
        echo "   🔄 Updating global configuration..."
        if command -v rsync &> /dev/null; then
            rsync -au "$SOURCE_OPENCODE/" "$TARGET_DIR/"
        else
            cp -ru "$SOURCE_OPENCODE/"* "$TARGET_DIR/"
        fi
    fi
else
    # Project: Copy .opencode FOLDER to ./.opencode
    sync_item "$SOURCE_OPENCODE" "$TARGET_DIR/.opencode"
fi

# 6. Cleanup
rm -rf $TEMP_DIR

echo "✅ Done!"
