#!/bin/bash
# Auto-sync: called by launchd when files change in this folder.
# Commits any changes and pushes to GitHub.

REPO_DIR="/Users/molecula/Desktop/Core Design System"
LOG="$REPO_DIR/.sync.log"

cd "$REPO_DIR" || exit 1

# Wait briefly so rapid file saves are batched together
sleep 2

if [ -n "$(git status --porcelain)" ]; then
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git add -A
    git commit -m "Auto-sync: $TIMESTAMP" >> "$LOG" 2>&1
    if git push origin main >> "$LOG" 2>&1; then
        echo "[$TIMESTAMP] Pushed successfully" >> "$LOG"
    else
        echo "[$TIMESTAMP] Push failed — check credentials or network" >> "$LOG"
    fi
fi
