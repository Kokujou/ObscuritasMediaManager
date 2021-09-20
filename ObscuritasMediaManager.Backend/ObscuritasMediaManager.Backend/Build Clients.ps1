cd $PSScriptRoot
. .\nswag_template\CreateNSwagProject.ps1 -workingDirectory ../..
cd $PSScriptRoot
cd .\nswag_template\nswag_client
npm install
tsc --build .