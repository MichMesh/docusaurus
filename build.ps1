param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Message
)

if ($Message.Count -gt 0) {
    npm run build
    if (Test-Path build) { git add build/* }
    if (Test-Path docs) { git add docs/* }
    git commit -am ($Message -join " ")
    git push
}
else {
    Write-Host "Please supply a commit message"
    Write-Host "    $PSCommandPath `"this is my badass change to our ballin docs`""
}
