# PowerShell script to remove backend node_modules from git tracking
Write-Host "Fixing backend node_modules git tracking issue..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "auth-system\backend")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Current directory should contain the 'auth-system' folder" -ForegroundColor Red
    exit 1
}

Write-Host "Project structure found. Proceeding..." -ForegroundColor Green

# Remove backend node_modules from git cache
Write-Host "Removing auth-system/backend/node_modules from git index..." -ForegroundColor Cyan
git rm -r --cached auth-system/backend/node_modules 2>$null

# Also try other possible paths
git rm -r --cached auth-system\backend\node_modules 2>$null

# Stage the updated .gitignore
Write-Host "Adding updated .gitignore to staging..." -ForegroundColor Cyan
git add .gitignore

# Stage the backend .gitignore and .npmrc if they exist
if (Test-Path "auth-system\backend\.gitignore") {
    Write-Host "Adding backend .gitignore..." -ForegroundColor Cyan
    git add auth-system\backend\.gitignore
}

if (Test-Path "auth-system\backend\.npmrc") {
    Write-Host "Adding backend .npmrc..." -ForegroundColor Cyan
    git add auth-system\backend\.npmrc
}

# Show current status
Write-Host "`nCurrent git status:" -ForegroundColor Green
git status

Write-Host "`nDone! Backend node_modules should now be properly ignored." -ForegroundColor Green
Write-Host "To commit these changes, run:" -ForegroundColor Yellow
Write-Host "git commit -m 'Fix: Remove backend node_modules from tracking and update gitignore'" -ForegroundColor Yellow

Write-Host "`nTo test your server, run:" -ForegroundColor Cyan
Write-Host "cd auth-system\backend" -ForegroundColor Cyan
Write-Host "node server.js" -ForegroundColor Cyan 