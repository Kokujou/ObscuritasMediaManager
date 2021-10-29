cd $PSScriptRoot
. .\nswag_template\CreateNSwagProject.ps1 -workingDirectory ../..
cd $PSScriptRoot
copy .\nswag_template\nswag_client\dist\obscuritas-media-manager-backend-client.js ../../ObscuritasMediaManager.Frontend/obscuritas-media-manager-backend-client.js
copy .\nswag_template\nswag_client\dist\obscuritas-media-manager-backend-client.d.ts ../../ObscuritasMediaManager.Frontend/obscuritas-media-manager-backend-client.d.ts