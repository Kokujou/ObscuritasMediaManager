param(
    [Parameter(Mandatory = $true)]
    [string]$OldDb,

    [Parameter(Mandatory = $true)]
    [string]$NewDb
)

$ErrorActionPreference = "Stop"

# Absolute Pfade
$OldDb = (Resolve-Path $OldDb).Path
$NewDb = (Resolve-Path $NewDb).Path

Write-Host ""
Write-Host "ALTE DB: $OldDb"
Write-Host "NEUE DB: $NewDb"
Write-Host ""

# Hilfsfunktion für SQLite-Identifier:
# Name -> "Name"
function Quote-Identifier {
    param([string]$Name)

    return '"' + $Name.Replace('"', '""') + '"'
}

# Alle Tabellen aus der NEUEN DB holen
$newTables = sqlite3 $NewDb @"
SELECT name
FROM sqlite_master
WHERE type = 'table'
AND name NOT LIKE 'sqlite_%'
ORDER BY name;
"@

foreach ($table in $newTables) {

    $table = $table.Trim()

    if ([string]::IsNullOrWhiteSpace($table)) {
        continue
    }

    Write-Host ""
    Write-Host "========================================"
    Write-Host "Tabelle: $table"

    # Sicherer Tabellenname
    $safeTable = Quote-Identifier $table

    # Prüfen, ob die Tabelle in der alten DB existiert
    $escapedTableName = $table.Replace("'", "''")

    $checkSql = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='$escapedTableName';"

    $oldTableExists = sqlite3 $OldDb $checkSql

    if ($oldTableExists.Trim() -eq "0") {
        Write-Host "  -> Nicht in alter DB vorhanden. Übersprungen."
        continue
    }

    # Spalteninformationen holen
    $pragmaSql = "PRAGMA table_info($safeTable);"

    $newColumnsRaw = sqlite3 $NewDb $pragmaSql
    $oldColumnsRaw = sqlite3 $OldDb $pragmaSql

    # Aus cid|name|type|notnull|default|pk nur den Namen holen
    $newColumnNames = @(
        $newColumnsRaw |
        Where-Object { $_ -and $_.Trim() -ne "" } |
        ForEach-Object {
            ($_ -split '\|')[1]
        }
    )

    $oldColumnNames = @(
        $oldColumnsRaw |
        Where-Object { $_ -and $_.Trim() -ne "" } |
        ForEach-Object {
            ($_ -split '\|')[1]
        }
    )

    # Nur Spalten, die in beiden Tabellen existieren
    $commonColumns = @(
        $newColumnNames |
        Where-Object { $oldColumnNames -contains $_ }
    )

    if ($commonColumns.Count -eq 0) {
        Write-Host "  -> Keine gemeinsamen Spalten. Übersprungen."
        continue
    }

    # Alte Spalten, die ignoriert werden
    $ignoredOld = @(
        $oldColumnNames |
        Where-Object { $newColumnNames -notcontains $_ }
    )

    Write-Host "  Gemeinsame Spalten:"
    Write-Host "    $($commonColumns -join ', ')"

    if ($ignoredOld.Count -gt 0) {
        Write-Host "  Ignorierte alte Spalten:"
        Write-Host "    $($ignoredOld -join ', ')"
    }

    # Spaltennamen für SQL quoten
    $quotedColumns = (
        $commonColumns |
        ForEach-Object { Quote-Identifier $_ }
    ) -join ", "

    # Alte DB an neue DB anhängen
    $safeOldDbPath = $OldDb.Replace("'", "''")

    $sql = @"
PRAGMA foreign_keys = OFF;

ATTACH DATABASE '$safeOldDbPath' AS olddb;

INSERT OR IGNORE INTO $safeTable ($quotedColumns)
SELECT $quotedColumns
FROM olddb.$safeTable;

DETACH DATABASE olddb;
"@

    try {
$tempSql = Join-Path $env:TEMP "sqlite_migration.sql"

[System.IO.File]::WriteAllText(
    $tempSql,
    $sql,
    [System.Text.UTF8Encoding]::new($false)
)

$result = cmd /c "sqlite3 `"$NewDb`" < `"$tempSql`"" 2>&1

Remove-Item $tempSql -Force

        if ($LASTEXITCODE -ne 0) {
            Write-Host "  !!! SQLITE-FEHLER:"
            Write-Host $result
        }
        else {
            Write-Host "  -> Fertig importiert."
        }
    }
    catch {
        Write-Host "  !!! POWERSHELL-FEHLER:"
        Write-Host $_
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Migration abgeschlossen."
Write-Host ""

# Foreign-Key-Check
Write-Host "Prüfe Foreign Keys..."

$fkCheck = sqlite3 $NewDb "PRAGMA foreign_key_check;"

if ([string]::IsNullOrWhiteSpace($fkCheck)) {
    Write-Host "Keine Foreign-Key-Fehler gefunden."
}
else {
    Write-Host "FOREIGN-KEY-FEHLER:"
    Write-Host $fkCheck
}