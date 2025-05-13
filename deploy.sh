#!/bin/bash

# Script to deploy updates to GitHub

echo "📦 Starting deployment to GitHub..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ Not in a git repository. Please run this script from within your git repository."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "🔍 Current branch: $CURRENT_BRANCH"

# Check for unstaged changes
if ! git diff --exit-code > /dev/null; then
    echo "📝 Unstaged changes detected. Adding all changes..."
    git add .
fi

# Check for staged changes
if ! git diff --cached --exit-code > /dev/null; then
    echo "💾 Committing changes..."
    git commit -m "Update website with Turkish crypto exchange logos and new pages"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to GitHub!"
    echo "🌐 Vercel should now pick up these changes and deploy your site automatically."
else
    echo "❌ Failed to push to GitHub. Please check your internet connection and repository permissions."
    exit 1
fi

echo "👋 Deployment complete!" 