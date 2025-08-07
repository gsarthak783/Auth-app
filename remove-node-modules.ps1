# PowerShell script to remove node_modules from git tracking
Write-Host "Removing node_modules from git tracking..." -ForegroundColor Yellow

# Navigate to project root if needed
if (Test-Path "auth-system") {
    Write-Host "Found auth-system directory, navigating to project root" -ForegroundColor Green
} else {
    Write-Host "Already in project root" -ForegroundColor Green
}

# Remove node_modules from git cache (this doesn't delete the files)
Write-Host "Removing node_modules from git index..." -ForegroundColor Cyan
git rm -r --cached node_modules 2>$null
git rm -r --cached auth-system/backend/node_modules 2>$null
git rm -r --cached auth-system/frontend/node_modules 2>$null
git rm -r --cached */node_modules 2>$null
git rm -r --cached **/node_modules 2>$null

# Stage the .gitignore changes
Write-Host "Adding .gitignore to staging..." -ForegroundColor Cyan
git add .gitignore

# Show status
Write-Host "Current git status:" -ForegroundColor Green
git status

Write-Host "Done! node_modules should now be properly ignored." -ForegroundColor Green
Write-Host "You can now commit these changes with:" -ForegroundColor Yellow
Write-Host "git commit -m 'Remove node_modules from tracking and update .gitignore'" -ForegroundColor Yellow 