Param(
    [Parameter(Mandatory=$true)]
    $sourceBranch
)
$ErrorActionPreference = "Stop"

function Get-CSharpClientVersion {
    [string]$nugetVersion = "0.0.0"
    $csharpClient = Get-ChildItem -Filter "*.Client.csproj" -Recurse | Select-Object -First 1
    $csharpClientName = $csharpClient.Name.Replace(".csproj","")

    $username = "John Doe"
    $password = "$env:SYSTEM_ACCESSTOKEN"
    $secstr = convertto-securestring -String "$password" -AsPlainText -Force
    
    try{
        $cred = New-Object System.Management.Automation.PSCredential($username, $secstr)
        $response= Invoke-WebRequest -Credential $cred "https://pkgs.dev.azure.com/cc-sg/_packaging/55924783-ffaa-4215-a0ca-0414680a629b/nuget/v3/flat2/$csharpClientName/index.json"
        $responseObject = ConvertFrom-Json $response
        $nugetVersion = $responseObject.versions[0] 
    }
    catch{}

    if((!$nugetVersion) -or ($nugetVersion -notmatch '^([0-9]+)\.([0-9]+)\.([0-9]+)$')){
        $nugetVersion = "0.0.0"
    }
    return $nugetVersion
}

function Get-TypescriptClientversion {
    [string]$npmVersion = "0.0.0"
    $typescriptClient = Get-ChildItem -Filter "*-client.ts"  -Recurse | Select-Object -First 1
    $typescriptClientName = $typescriptClient.Name.Replace(".ts","");
    $npmversion = invoke-command -ArgumentList $typescriptClientName -ScriptBlock { 
        $ErrorActionPreference ="silentlycontinue" # this will make sure, on npm error the $error variable of PS will not be populated
        return (npm show @ccsoftwaregroup/$Args[0] version --silent)
    }
    if($npmVersion -notmatch '^([0-9]+)\.([0-9]+)\.([0-9]+)$'){
        $npmVersion = "0.0.0"
    }
    return $npmVersion
}

[string] $npmVersion = Get-TypescriptClientversion
[string] $nugetVersion = Get-CSharpClientVersion

Write-Host "nuget version: $nugetVersion"
Write-Host "npm version: $npmVersion"

if([version]$npmVersion -gt [version]$nugetVersion){
    $version = $npmVersion
    write-Host "npm version $npmVersion bigger as nuget version $nugetVersion"
}
else{
    $version = $nugetVersion
    write-Host "nuget version $nugetVersion bigger as npm version $npmVersion"
}

if($sourceBranch -eq "master"){
    $versionIndex = 0
    Write-Host "detected master-branch, incrementing prod version"
}
elseif($sourceBranch -eq "release" -or $sourceBranch -eq "develop"){
    $versionIndex = 1
    Write-Host "detected prerelease-branch, incrementing prerelease version"
}
else{
    $versionIndex = 2
    Write-Host "detected ongoing development, incrementing development version"
}

$subVersions = $version.Split('.')
$activeVersion = $subVersions[$versionIndex];
$activeVersion = ($activeVersion -as [int]) + 1;
$subVersions[$versionIndex] = $activeVersion
    
for($i = $versionIndex + 1; $i -le 2; $i++){
    $subVersions[$i] = "0"
}
$version = [System.String]::Join('.',$subVersions)

Write-Host "write the new client version $version into environment variable clientPackageVersion"
Write-Output "##vso[task.setvariable variable=clientPackageVersion]$version"
