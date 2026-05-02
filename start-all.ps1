param(
  [switch]$UseDockerDb,
  [switch]$SkipNpmInstall,
  [switch]$SkipMavenVerify
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'
$runtimeDir = Join-Path $root '.runtime'

if (!(Test-Path $backendDir)) { throw "No se encontro backend en $backendDir" }
if (!(Test-Path $frontendDir)) { throw "No se encontro frontend en $frontendDir" }

New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null

if ($UseDockerDb) {
  if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker no esta instalado o no esta en PATH.'
  }

  Push-Location $root
  try {
    docker compose up -d postgres
  }
  finally {
    Pop-Location
  }
}

if (!(Test-Path (Join-Path $frontendDir '.env'))) {
  if (Test-Path (Join-Path $frontendDir '.env.example')) {
    Copy-Item (Join-Path $frontendDir '.env.example') (Join-Path $frontendDir '.env') -Force
  }
  else {
    'VITE_API_BASE_URL=http://localhost:8080' | Set-Content -Path (Join-Path $frontendDir '.env') -Encoding UTF8
  }
}

if (!$SkipMavenVerify) {
  Write-Host 'Validando backend con Maven...' -ForegroundColor Cyan
  Push-Location $backendDir
  try {
    & .\mvnw.cmd -q test -DskipTests
    if ($LASTEXITCODE -ne 0) { throw 'Fallo la validacion Maven del backend.' }
  }
  finally {
    Pop-Location
  }
}

if (!(Test-Path (Join-Path $frontendDir 'node_modules')) -and !$SkipNpmInstall) {
  Write-Host 'Instalando dependencias de frontend...' -ForegroundColor Cyan
  Push-Location $frontendDir
  try {
    npm install
    if ($LASTEXITCODE -ne 0) { throw 'Fallo npm install en frontend.' }
  }
  finally {
    Pop-Location
  }
}

$backendLog = Join-Path $runtimeDir 'backend.log'
$frontendLog = Join-Path $runtimeDir 'frontend.log'
$pidFile = Join-Path $runtimeDir 'pids.json'

$backendCommand = '.\\mvnw.cmd spring-boot:run > "' + $backendLog + '" 2>&1'
$frontendCommand = 'npm run dev -- --host 0.0.0.0 --port 5173 > "' + $frontendLog + '" 2>&1'

$backendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $backendCommand -WorkingDirectory $backendDir -PassThru -WindowStyle Hidden
$frontendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $frontendCommand -WorkingDirectory $frontendDir -PassThru -WindowStyle Hidden

@{
  backendPid = $backendProc.Id
  frontendPid = $frontendProc.Id
  startedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
} | ConvertTo-Json | Set-Content -Path $pidFile -Encoding UTF8

Write-Host ''
Write-Host 'Servicios iniciados.' -ForegroundColor Green
Write-Host 'Backend PID: ' $backendProc.Id
Write-Host 'Frontend PID:' $frontendProc.Id
Write-Host ''
Write-Host 'URLs:' -ForegroundColor Yellow
Write-Host '  Backend Health : http://localhost:8080/actuator/health'
Write-Host '  Swagger        : http://localhost:8080/swagger-ui/index.html'
Write-Host '  Frontend       : http://localhost:5173'
if ($UseDockerDb) {
  Write-Host '  PGAdmin        : http://localhost:5050 (si levantas profile tools)'
}
Write-Host ''
Write-Host 'Logs:' -ForegroundColor Yellow
Write-Host "  $backendLog"
Write-Host "  $frontendLog"
Write-Host ''
Write-Host 'Para detener todo ejecuta: .\\stop-all.ps1' -ForegroundColor Cyan
