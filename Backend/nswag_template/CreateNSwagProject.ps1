Param(
    #C:\Users\torben.koch.MUCMC564\Projects\PH_InstallationLogic
    [Parameter(Mandatory=$true)]
    $workingDirectory,

    [string] $configuration = "Debug",

    $sourceFramework = "net8.0",
    $clientTargetRuntime = "Net60"
)
cd $PSScriptRoot
function Resolve-Parameters(){
    $directory = Resolve-Path -Path $workingDirectory
    Write-Host $directory
    $solution = Get-ChildItem -Include "*.sln" -Path $directory.Path -Recurse
    $solutionName = $solution.Name.Replace(".sln","")

    $global:sourceProjectPath = (Get-Item -Path "$($solution.Directory.FullName)/$solutionName.csproj").FullName
    Write-Host "Writing variable sourceProjectPath=$sourceProjectPath"
    $global:csProjectNamespace = $solutionName
    Write-Host "Writing variable csProjectNamespace=$csProjectNamespace"
    $global:csExceptionClassName = "$($solutionName.Replace('.',''))Exception"
    Write-Host "Writing variable csExceptionClassName=$csExceptionClassName"

    $snakeCaseSolutionName = [regex]::replace($solutionName.Replace('.',''), '(?!^[A-Z])([A-Z])(.)', { "_$($args[0].Groups[1].Value)$($args[0].Groups[2].Value)"})
    $snakeCaseSolutionName
    $global:tsBaseUrlTokenName = "$($snakeCaseSolutionName.ToUpper())_API_BASE_URL"
    Write-Host "Writing variable tsBaseUrlTokenName=$tsBaseUrlTokenName"

    $global:tsProjectName = "$($snakeCaseSolutionName.ToLower().Replace("_","-"))-client"
    Write-Host "Writing variable tsProjectName=$tsProjectName"
}
Resolve-Parameters

$tsProjectNamePattern = "%%TSProjectName%%"
$csProjectNamespacePattern = "%%CSTargetNamespace%%"
$sourceProjectPathPattern = "%%SourceProjectPath%%"
$sourceFrameworkPattern = "%%SourceFramework%%"
$clientTargetRuntimePattern = "%%ClientTargetRuntime%%"
$tsBaseUrlTokenNamePattern = "%%TSBaseUrlTokenName%%"
$csExceptionClassNamePattern="%%CSExceptionClassName%%"
$configurationPattern = "%%configuration%%"

function Rename-CustomProperties([string] $fileContent){
    $fileContent = $fileContent -replace $tsProjectNamePattern, $tsProjectName
    $fileContent = $fileContent -replace $csProjectNamespacePattern, $csProjectNamespace
    $fileContent = $fileContent -replace $sourceProjectPathPattern, $sourceProjectPath -replace "\\","/"
    $fileContent = $fileContent -replace $sourceFrameworkPattern, $sourceFramework
    $fileContent = $fileContent -replace $clientTargetRuntimePattern, $clientTargetRuntime
    $fileContent = $fileContent -replace $tsBaseUrlTokenNamePattern, $tsBaseUrlTokenName
    $fileContent = $fileContent -replace $csExceptionClassNamePattern, $csExceptionClassName
    $fileContent = $fileContent -replace $configurationPattern, $configuration

    return $fileContent
}

Set-Location $PSScriptRoot

$targetProjectFolder = "./nswag_client"
Remove-Item -Path $targetProjectFolder -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path $targetProjectFolder -ItemType Directory -Force

$packageTemplate = Get-Content "./package.template.json" -Raw
$dotnetProjectTemplate = Get-Content "./dotnet.project.template.csproj" -Raw
$nswagTemplate = Get-Content "./nswag.template.json" -Raw

New-Item "$targetProjectFolder/package.json" -Value $(Rename-CustomProperties -fileContent $packageTemplate) -Force
New-Item "$targetProjectFolder/$csProjectNamespace.Client.csproj" -Value $(Rename-CustomProperties -fileContent $dotnetProjectTemplate) -Force
New-Item "$targetProjectFolder/nswag.json" -Value $(Rename-CustomProperties -fileContent $nswagTemplate) -Force

Copy-Item .\tsconfig.json "$targetProjectFolder/tsconfig.json" -Force

dotnet publish $targetProjectFolder -c "$configuration"
cd $targetProjectFolder
npm install typescript -g
tsc --project tsconfig.json
cd $PSScriptRoot
copy-item .\nswag_client\dist\* ..\..\..\ObscuritasMediaManager\Frontend -Recurse
