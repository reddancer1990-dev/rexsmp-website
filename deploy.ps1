# Deploy Rex SMP website to GitHub Pages (free) -> https://rexsmp.com
# One-time: gh auth login

$ErrorActionPreference = "Stop"
$SiteDir = $PSScriptRoot
$RepoName = "rexsmp-website"
$Domain = "rexsmp.com"

Set-Location $SiteDir

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "Install GitHub CLI: winget install GitHub.cli"
    exit 1
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "STEP 1 - Log into GitHub (one time):"
    Write-Host "  gh auth login"
    Write-Host ""
    Write-Host "Then run this script again."
    exit 1
}

$owner = gh api user -q .login
$fullRepo = "$owner/$RepoName"
$gitEmail = "$owner@users.noreply.github.com"

if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

git add index.html css js CNAME .nojekyll robots.txt sitemap.xml .well-known deploy.ps1 protect-cloudflare.ps1
$pending = git status --porcelain
if ($pending) {
    git -c "user.name=$owner" -c "user.email=$gitEmail" commit -m "Rex SMP website for $Domain"
}

$repoExists = $false
$prevErrorAction = $ErrorActionPreference
$ErrorActionPreference = "Continue"
gh repo view $fullRepo *> $null
if ($LASTEXITCODE -eq 0) {
    $repoExists = $true
}
$ErrorActionPreference = $prevErrorAction

if (-not $repoExists) {
    gh repo create $RepoName --public --source=. --remote=origin --push
} else {
    if (-not (git remote get-url origin 2>$null)) {
        git remote add origin "https://github.com/$fullRepo.git"
    }
    git push -u origin main
}

$ErrorActionPreference = "Continue"
gh api "repos/$fullRepo/pages" -X POST `
    -f build_type=legacy `
    -f "source[branch]=main" `
    -f "source[path]=/" 2>$null | Out-Null

gh api "repos/$fullRepo/pages" -X PUT `
    -f build_type=legacy `
    -f "source[branch]=main" `
    -f "source[path]=/" `
    -f "cname=$Domain" 2>$null | Out-Null
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Site uploaded to GitHub Pages ==="
Write-Host ""
Write-Host "Repo:       https://github.com/$fullRepo"
Write-Host "Temp URL:   https://$owner.github.io/$RepoName/"
Write-Host "Live URL:   https://$Domain  (after DNS step below)"
Write-Host ""
Write-Host "=== STEP 2 - GoDaddy DNS for rexsmp.com ==="
Write-Host ""
Write-Host "  Type   Name   Value"
Write-Host "  A      @      185.199.108.153"
Write-Host "  A      @      185.199.109.153"
Write-Host "  A      @      185.199.110.153"
Write-Host "  A      @      185.199.111.153"
Write-Host "  CNAME  www    $owner.github.io"
Write-Host ""
Write-Host "=== STEP 3 - Boost protections (optional) ==="
Write-Host "Run:  .\protect-cloudflare.ps1"
Write-Host ""
Write-Host "Wait 5-30 minutes after DNS, then visit https://$Domain"
Write-Host ""
