# PublishScript for AccessKit packages
Write-Host "Publishing AccessKit packages to npm..." -ForegroundColor Cyan

# Check if user is logged into npm
Write-Host "Checking npm authentication..." -ForegroundColor Yellow
$npmWhoami = npm whoami 2>$null
if (-not $npmWhoami) {
    Write-Host "You need to login to npm first:" -ForegroundColor Red
    Write-Host "   npm login" -ForegroundColor Yellow
    exit 1
}

Write-Host "Logged in as: $npmWhoami" -ForegroundColor Green

# Build and publish core SDK
Write-Host "Building and publishing @gsarthak783/accesskit-auth..." -ForegroundColor Cyan
Set-Location "auth-system\sdk"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the package
Write-Host "Building package..." -ForegroundColor Yellow
npm run build

# Publish to npm
Write-Host "Publishing to npm..." -ForegroundColor Yellow
npm publish

if ($LASTEXITCODE -eq 0) {
    Write-Host "@gsarthak783/accesskit-auth published successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to publish @gsarthak783/accesskit-auth" -ForegroundColor Red
    Set-Location "..\..\"
    exit 1
}

# Build and publish React SDK
Write-Host "Building and publishing @gsarthak783/accesskit-react..." -ForegroundColor Cyan
Set-Location "..\sdk-react"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the package
Write-Host "Building package..." -ForegroundColor Yellow
npm run build

# Publish to npm
Write-Host "Publishing to npm..." -ForegroundColor Yellow
npm publish

if ($LASTEXITCODE -eq 0) {
    Write-Host "@gsarthak783/accesskit-react published successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to publish @gsarthak783/accesskit-react" -ForegroundColor Red
    Set-Location "..\..\"
    exit 1
}

# Return to root
Set-Location "..\..\"

Write-Host "All packages published successfully!" -ForegroundColor Green
Write-Host "Published packages:" -ForegroundColor Cyan
Write-Host "   • @gsarthak783/accesskit-auth - Core authentication SDK" -ForegroundColor White
Write-Host "   • @gsarthak783/accesskit-react - React hooks and components" -ForegroundColor White
Write-Host "View on npm:" -ForegroundColor Cyan
Write-Host "   • https://npmjs.com/package/@gsarthak783/accesskit-auth" -ForegroundColor Blue
Write-Host "   • https://npmjs.com/package/@gsarthak783/accesskit-react" -ForegroundColor Blue
Write-Host "Documentation: https://access-kit-server.vercel.app" -ForegroundColor Cyan 