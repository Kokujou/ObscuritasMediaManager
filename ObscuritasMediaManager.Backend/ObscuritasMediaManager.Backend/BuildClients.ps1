param(
$Configuration = "Debug"
)
cd $PSScriptRoot
start-process  powershell.exe -WindowStyle hidden  -ArgumentList ".\nswag_template\CreateNSwagProject.ps1 -workingDirectory ../.. -configuration $Configuration" 