#Requires -Version 5.1
param(
  [switch]$StopDockerDb
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDir = Join-Path $root '.runtime'
$pidFile = Join-Path $runtimeDir 'pids.json'

function Stop-OnePid([long]$Pid) {
  if (-not $Pid) { return }
  try {
    Stop-Process -Id ([int]$Pid) -Force -ErrorAction Stop
    Write-Host "Proceso $Pid detenido." -ForegroundColor Yellow
  }
  catch {
    Write-Host "Proceso $Pid ya no corría." -ForegroundColor DarkGray
  }
}

if (Test-Path -LiteralPath $pidFile) {
  try {
    $data = Get-Content -LiteralPath $pidFile -Raw | ConvertFrom-Json
    Stop-OnePid $data.backendPid
    Stop-OnePid $data.frontendPid
  }
  catch {
    Write-Host 'pids.json dañado; se limpiaran puertos conocidos.' -ForegroundColor DarkYellow
  }
  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
}

foreach ($port in 8080, 5173) {
  $conns = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
  foreach ($c in $conns) {
    if ($c.OwningProcess -and $c.OwningProcess -gt 0) {
      try {
        Stop-Process -Id $c.OwningProcess -Force -ErrorAction Stop
        Write-Host "Puerto $port liberado (PID $($c.OwningProcess))." -ForegroundColor Yellow
      }
      catch {
        Write-Host "No se pudo liberar el puerto $port (PID $($c.OwningProcess))." -ForegroundColor Red
      }
    }
  }
}

if ($StopDockerDb -and (Get-Command docker -ErrorAction SilentlyContinue)) {
  Push-Location $root
  try {
    docker compose stop postgres | Out-Host
  }
  finally {
    Pop-Location
  }
}

Write-Host 'Detencion finalizada.' -ForegroundColor Green
