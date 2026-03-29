# Check if Node.js is installed
$nodeInstalled = $null -ne (Get-Command node -ErrorAction SilentlyContinue)

# Check if npm is installed
$npmInstalled = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)

# Install Node.js if it's not installed
if (-not $nodeInstalled) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Install npm if it's not installed
if (-not $npmInstalled) {
    Write-Host "npm is not installed. Please install npm."
    exit 1
}

# If node_modules doesn't exist, reinstall dependencies
if (-not (Test-Path node_modules)) {
    npm run clear
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item -Force yarn.lock -ErrorAction SilentlyContinue
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
    npm install
}

# Run the dev server
npm run start
