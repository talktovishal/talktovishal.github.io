$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "../../../../..")
$python = Join-Path $root "tmp/manim-venv/Scripts/python.exe"
$sceneFile = Join-Path $PSScriptRoot "chapter4_scenes.py"
$outputDir = Resolve-Path (Join-Path $PSScriptRoot "../videos")
$mediaDir = Join-Path $root "tmp/manim-media"

$scenes = @(
  "ForwardPassScene",
  "SoftmaxLossScene",
  "BackpropBlameScene",
  "GradientUpdateScene"
)

$targets = @{
  ForwardPassScene = "chapter4-forward-pass.mp4"
  SoftmaxLossScene = "chapter4-softmax-loss.mp4"
  BackpropBlameScene = "chapter4-backprop-blame.mp4"
  GradientUpdateScene = "chapter4-gradient-update.mp4"
}

foreach ($scene in $scenes) {
  & $python -m manim $sceneFile $scene -ql --media_dir $mediaDir --format mp4 --disable_caching
  $rendered = Join-Path $mediaDir "videos/chapter4_scenes/720p15/$scene.mp4"
  $target = Join-Path $outputDir $targets[$scene]
  Copy-Item -LiteralPath $rendered -Destination $target -Force
}
