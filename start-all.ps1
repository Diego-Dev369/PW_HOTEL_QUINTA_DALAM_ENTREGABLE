#Requires -Version 5.1
param(
  [switch]$UseDockerDb,
  [switch]$SkipNpmInstall,
  [switch]$SkipMavenCompile,
  [switch]$SkipMavenVerify,
  [switch]$SkipFlywayRepair
)

if ($SkipMavenVerify) { $SkipMavenCompile = $true }

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root 'backend'
$frontendDir = Join-Path $root 'frontend'
$runtimeDir = Join-Path $root '.runtime'
$envExample = Join-Path $root '.env.example'
$envFile = Join-Path $root '.env'
$mavenRepoLocal = Join-Path $backendDir '.m2\repository'

if (-not $env:MAVEN_USER_HOME) {
  $env:MAVEN_USER_HOME = Join-Path $backendDir '.m2'
}
New-Item -ItemType Directory -Path $env:MAVEN_USER_HOME -Force | Out-Null
New-Item -ItemType Directory -Path $mavenRepoLocal -Force | Out-Null

function Import-EnvFromFile([string]$Path) {
  if (!(Test-Path -LiteralPath $Path)) { return }
  foreach ($raw in Get-Content -LiteralPath $Path) {
    $line = $raw.Trim()
    if ($line -eq '' -or $line.StartsWith('#')) { continue }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { continue }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
      $val = $val.Substring(1, $val.Length - 2)
    }
    Set-Item -Path "Env:$key" -Value $val
  }
}

function Parse-JdbcPostgresUrl([string]$jdbcUrl) {
  $fallback = @{ Host = 'localhost'; Port = 5432; Database = 'quinta_dalam_db' }
  if ([string]::IsNullOrWhiteSpace($jdbcUrl)) { return $fallback }
  # jdbc:postgresql://host:5432/name  or  jdbc:postgresql://host/name
  if ($jdbcUrl -notmatch '^jdbc:postgresql://([^/\?;:]+)(?::(\d+))?/([^/\?]+)') {
    return $fallback
  }
  $dbHost = $Matches[1]
  $db = $Matches[3]
  $port = if ($Matches[2]) { [int]$Matches[2] } else { 5432 }
  return @{ Host = $dbHost; Port = $port; Database = $db }
}

function Wait-TcpOpen {
  param(
    [string]$ComputerName,
    [int]$Port,
    [int]$TimeoutSeconds = 90
  )
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $r = Test-NetConnection -ComputerName $ComputerName -Port $Port -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
      if ($r.TcpTestSucceeded) { return }
    }
    catch { }
    Start-Sleep -Seconds 1
  }
  throw "Timeout: no responde $($ComputerName):$Port despues de ${TimeoutSeconds}s."
}

function Wait-DockerPostgresHealthy {
  param([int]$TimeoutSeconds = 120)
  $u = $env:POSTGRES_USER
  if (-not $u) { $u = 'postgres' }
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    docker exec quintadalam-postgres pg_isready -U $u -d quinta_dalam_db 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { return }
    Start-Sleep -Seconds 2
  }
  throw 'Timeout esperando Postgres en Docker (pg_isready).'
}

function Wait-BackendHealthy {
  param(
    [string]$Url = 'http://127.0.0.1:8080/actuator/health',
    [int]$TimeoutSeconds = 150
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $resp = Invoke-RestMethod -Uri $Url -TimeoutSec 3 -ErrorAction Stop

      if ($null -ne $resp.status -and $resp.status -eq 'UP') {
        return
      }
    }
    catch {
      # backend aun iniciando
    }

    Start-Sleep -Milliseconds 750
  }

  throw "Timeout: backend actuator/health no mostro UP en $Url."
}

function Ensure-PgDatabase {
  param(
    [string]$dbHost,
    [int]$Port,
    [string]$User,
    [string]$PlainPassword,
    [string]$TargetDbName
  )
  if (-not (Get-Command psql -ErrorAction SilentlyContinue)) { return }
  $prev = $env:PGPASSWORD
  try {
    $env:PGPASSWORD = $PlainPassword
    $exists = & psql -h $dbHost -p $Port -U $User -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${TargetDbName}'" 2>$null
    if ($LASTEXITCODE -eq 0 -and -not ([string]::IsNullOrWhiteSpace($exists))) {
      return
    }
    & psql -h $dbHost -p $Port -U $User -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE `"$TargetDbName`";" | Out-Null
    Write-Host "Base de datos creada: $TargetDbName" -ForegroundColor Cyan
  }
  finally {
    if ($null -eq $prev) { Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue } else { $env:PGPASSWORD = $prev }
  }
}

# --- validacion basica ---
if (!(Test-Path -LiteralPath $backendDir)) { throw "No existe backend en $backendDir." }
if (!(Test-Path -LiteralPath $frontendDir)) { throw "No existe frontend en $frontendDir." }
if (!(Get-Command npm -ErrorAction SilentlyContinue)) { throw 'npm no esta instalado o no esta en PATH.' }
if (!(Get-Command java -ErrorAction SilentlyContinue)) { throw 'java no esta instalado o JAVA_HOME/JDK no configurado para el wrapper.' }

# --- detener instancia previa (no toca Docker) ---
$stopScript = Join-Path $root 'stop-all.ps1'
if (Test-Path -LiteralPath $stopScript) {
  try { & $stopScript | Out-Host } catch { }
}

New-Item -ItemType Directory -Path $runtimeDir -Force | Out-Null

# --- .env raiz ---
if (!(Test-Path -LiteralPath $envFile)) {
  if (Test-Path -LiteralPath $envExample) {
    Copy-Item -LiteralPath $envExample -Destination $envFile -Force
    Write-Host "Creado .env desde .env.example" -ForegroundColor Cyan
  }
  else {
    @(
      'POSTGRES_USER=postgres',
      'POSTGRES_PASSWORD=postgres',
      'SPRING_PROFILES_ACTIVE=dev',
      'DB_URL=jdbc:postgresql://localhost:5432/quinta_dalam_db',
      'DB_USERNAME=postgres',
      'DB_PASSWORD=postgres',
      'JWT_SECRET=zxc_development_fallback_replace_minimum_32_characters',
      'APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173',
      'PAYMENT_STRIPE_SECRET_KEY=',
      'PAYMENT_WEBHOOK_SECRET='
    ) -join "`n" | Set-Content -LiteralPath $envFile -Encoding UTF8
    Write-Host "Creado .env minimo de desarrollo." -ForegroundColor Cyan
  }
}
Import-EnvFromFile $envFile

# --- defaults coherentes ---
if (-not $env:DB_USERNAME) { $env:DB_USERNAME = 'postgres' }
if (-not $env:DB_PASSWORD) { $env:DB_PASSWORD = 'postgres' }
if (-not $env:DB_URL) { $env:DB_URL = 'jdbc:postgresql://localhost:5432/quinta_dalam_db' }
if (-not $env:POSTGRES_USER) { $env:POSTGRES_USER = $env:DB_USERNAME }
if (-not $env:POSTGRES_PASSWORD) { $env:POSTGRES_PASSWORD = $env:DB_PASSWORD }
if (-not $env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE = 'dev' }

$pgConn = Parse-JdbcPostgresUrl $env:DB_URL

if ($UseDockerDb) {
  if (!(Get-Command docker -ErrorAction SilentlyContinue)) { throw 'Docker no encontrado en PATH.' }
  Push-Location $root
  try {
    docker compose --env-file $envFile up -d postgres
    Wait-DockerPostgresHealthy -TimeoutSeconds 120
    Wait-TcpOpen -ComputerName $pgConn.Host -Port $pgConn.Port -TimeoutSeconds 60
  }
  finally {
    Pop-Location
  }
}
else {
  Wait-TcpOpen -ComputerName $pgConn.Host -Port $pgConn.Port -TimeoutSeconds 15
}

Ensure-PgDatabase -Host $pgConn.Host -Port $pgConn.Port -User $env:DB_USERNAME -PlainPassword $env:DB_PASSWORD -TargetDbName $pgConn.Database

# --- frontend .env ---
$feEnv = Join-Path $frontendDir '.env'
if (!(Test-Path -LiteralPath $feEnv)) {
  $feExample = Join-Path $frontendDir '.env.example'
  if (Test-Path -LiteralPath $feExample) {
    Copy-Item -LiteralPath $feExample -Destination $feEnv -Force
  }
  else {
    'VITE_API_BASE_URL=http://localhost:8080' | Set-Content -LiteralPath $feEnv -Encoding UTF8
  }
}

# --- Maven ---
if (!$SkipMavenCompile) {
  Write-Host 'Compilando backend (Maven)...' -ForegroundColor Cyan
  Push-Location $backendDir
  try {
    & .\mvnw.cmd -q "-Dmaven.repo.local=$mavenRepoLocal" -DskipTests clean compile
    if ($LASTEXITCODE -ne 0) { throw 'Fallo mvn compile en backend.' }
  }
  finally {
    Pop-Location
  }
}

# --- Flyway repair (checksums / historial desarrollo) ---
if (!$SkipFlywayRepair) {
  Write-Host 'Flyway repair (si aplica)...' -ForegroundColor Cyan
  Push-Location $backendDir
  try {
    $flyArgs = @(
      '-q',
      "-Dmaven.repo.local=$mavenRepoLocal",
      '-DskipTests',
      "flyway:repair",
      "-Dflyway.url=$($env:DB_URL)",
      "-Dflyway.user=$($env:DB_USERNAME)",
      "-Dflyway.password=$($env:DB_PASSWORD)"
    )
    & .\mvnw.cmd @flyArgs
    if ($LASTEXITCODE -ne 0) {
      Write-Host 'flyway:repair fallo (si la base es nueva y vacia, suele ser conexion). Revise DB_URL y credenciales.' -ForegroundColor DarkYellow
    }
  }
  finally {
    Pop-Location
  }
}

# --- npm ---
if (!(Test-Path (Join-Path $frontendDir 'node_modules')) -and !$SkipNpmInstall) {
  Write-Host 'npm install en frontend...' -ForegroundColor Cyan
  Push-Location $frontendDir
  try {
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'Fallo npm install.' }
  }
  finally {
    Pop-Location
  }
}

$backendLog = Join-Path $runtimeDir 'backend.log'
$frontendLog = Join-Path $runtimeDir 'frontend.log'
$pidFile = Join-Path $runtimeDir 'pids.json'

$backendCmd = '.\\mvnw.cmd -Dmaven.repo.local=' + $mavenRepoLocal + ' spring-boot:run >> "' + $backendLog + '" 2>&1'
$frontendCmd = 'npm run dev -- --host 0.0.0.0 --port 5173 >> "' + $frontendLog + '" 2>&1'

$backendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $backendCmd -WorkingDirectory $backendDir -PassThru -WindowStyle Hidden
if (-not $backendProc) { throw 'No se pudo lanzar backend.' }

Write-Host 'Esperando actuator/health UP...' -ForegroundColor Cyan
try {
  Wait-BackendHealthy -TimeoutSeconds 180
}
catch {
  Get-Content -LiteralPath $backendLog -Tail 80 -ErrorAction SilentlyContinue
  throw $_
}

$frontendProc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $frontendCmd -WorkingDirectory $frontendDir -PassThru -WindowStyle Hidden
if (-not $frontendProc) {
  Stop-Process -Id $backendProc.Id -Force -ErrorAction SilentlyContinue
  throw 'No se pudo lanzar frontend.'
}

 @{
  backendPid  = $backendProc.Id
  frontendPid = $frontendProc.Id
  startedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
} | ConvertTo-Json | Set-Content -LiteralPath $pidFile -Encoding UTF8

Write-Host ''
Write-Host 'Servicios iniciados.' -ForegroundColor Green
Write-Host "  Backend  PID $($backendProc.Id)"
Write-Host "  Frontend PID $($frontendProc.Id)"
Write-Host ''
Write-Host 'URLs' -ForegroundColor Yellow
Write-Host '  Frontend        http://localhost:5173'
Write-Host '  Backend health  http://localhost:8080/actuator/health'
Write-Host '  Swagger         http://localhost:8080/swagger-ui/index.html'
if ($UseDockerDb) {
  Write-Host '  Postgres Docker puerto localhost:5432 (DB quinta_dalam_db)'
}
Write-Host ''
Write-Host 'Logs' -ForegroundColor Yellow
Write-Host "  $backendLog"
Write-Host "  $frontendLog"
Write-Host ''
Write-Host 'Detener: .\\stop-all.ps1  (opcional Docker: .\\stop-all.ps1 -StopDockerDb)' -ForegroundColor Cyan
