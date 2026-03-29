param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Message
)

# Check if Node.js is installed
$nodeInstalled = $null -ne (Get-Command node -ErrorAction SilentlyContinue)

# Check if npm is installed
$npmInstalled = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)

# Exit if Node.js is not installed
if (-not $nodeInstalled) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Exit if npm is not installed
if (-not $npmInstalled) {
    Write-Host "npm is not installed. Please install npm."
    exit 1
}

# If node_modules doesn't exist, install dependencies
if (-not (Test-Path node_modules)) {
    npm install
}

if ($Message.Count -gt 0) {
    npm run clear
    npm run build
    git add build/* docs/*
    git commit -am ($Message -join " ")
    git push
}
else {
    Write-Host "Please supply a commit message"
    Write-Host "    $PSCommandPath `"this is my badass change to our ballin docs`""
}
