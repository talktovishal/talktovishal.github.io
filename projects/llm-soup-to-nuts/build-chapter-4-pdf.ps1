param(
  [string]$OutputPath = "assets/downloads/chapter-4-the-math-behind-next-word-prediction.pdf"
)

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkspaceRoot = Resolve-Path (Join-Path $ProjectDir "..\..\..")
$OutputFile = Join-Path $ProjectDir $OutputPath
$OutputDir = Split-Path -Parent $OutputFile
$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$HealthUrl = "http://127.0.0.1:8765/personal-site/projects/llm-soup-to-nuts/chapter-4-print.html"
$PreviewUrl = "http://127.0.0.1:8765/personal-site/projects/llm-soup-to-nuts/chapter-4-print.html?build=$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())"
$StartedServer = $false
$Server = $null

if (-not (Test-Path $Chrome)) {
  throw "Chrome was not found at $Chrome"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
Remove-Item -LiteralPath $OutputFile -Force -ErrorAction SilentlyContinue

try {
  try {
    Invoke-WebRequest -UseBasicParsing $HealthUrl -TimeoutSec 2 | Out-Null
  } catch {
    $Server = Start-Process -FilePath node -ArgumentList @('.codex-preview-server.cjs') -WorkingDirectory $WorkspaceRoot -WindowStyle Hidden -PassThru
    $StartedServer = $true
    $deadline = (Get-Date).AddSeconds(15)
    do {
      try {
        Invoke-WebRequest -UseBasicParsing $HealthUrl -TimeoutSec 2 | Out-Null
        break
      } catch {
        if ((Get-Date) -ge $deadline) { throw "The preview server did not start in time." }
      }
    } while ($true)
  }

  node (Join-Path $ProjectDir "chapter-4-pdf-build.cjs") $PreviewUrl $OutputFile $Chrome

  if (-not (Test-Path $OutputFile)) {
    throw "Chrome completed without creating $OutputFile"
  }

  $size = (Get-Item $OutputFile).Length
  if ($size -lt 100000) {
    throw "The generated PDF is unexpectedly small ($size bytes). The print companion may not have finished building."
  }

  Write-Output "Created $OutputFile ($([math]::Round($size / 1MB, 2)) MB)"
} finally {
  if ($StartedServer -and $Server -and -not $Server.HasExited) {
    Stop-Process -Id $Server.Id -Force -ErrorAction SilentlyContinue
  }
}
