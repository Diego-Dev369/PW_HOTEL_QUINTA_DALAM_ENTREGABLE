param(
  [switch]$StopDockerDb
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeDir = Join-Path $root '.runtime'
$pidFile = Join-Path $runtimeDir 'pids.json'

if (Test-Path $pidFile) {
  $data = Get-Content $pidFile -Raw | ConvertFrom-Json

  foreach ($procId in @($data.backendPid, $data.frontendPid)) {
    if ($procId) {
      try {
        Stop-Process -Id $procId -Force -ErrorAction Stop
        Write-Host "Proceso $procId detenido." -ForegroundColor Yellow
      }
      catch {
        Write-Host "Proceso $procId ya no estaba corriendo." -ForegroundColor DarkGray
      }
    }
  }

  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
else {
  Write-Host 'No se encontro archivo de PIDs. Intentando limpiar por puertos...' -ForegroundColor DarkGray
}

foreach ($port in 8080, 5173) {
  $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn) {
    try {
      Stop-Process -Id $conn.OwningProcess -Force -ErrorAction Stop
      Write-Host "Puerto $port liberado (PID $($conn.OwningProcess))." -ForegroundColor Yellow
    }
    catch {
      Write-Host "No se pudo liberar el puerto $port automaticamente." -ForegroundColor Red
    }
  }
}

if ($StopDockerDb) {
  if (Get-Command docker -ErrorAction SilentlyContinue) {
    Push-Location $root
    try {
      docker compose stop postgres
    }
    finally {
      Pop-Location
    }
  }
}

Write-Host 'Detencion finalizada.' -ForegroundColor Green
