# PowerShell Script para iniciar el entorno de desarrollo de A-Market

# --- Configuración ---
$containerName = "a-market-db"
$dbImage = "postgres:15-alpine"
$dbPort = 5432
$dbUser = "user"
$dbPassword = "password"
$dbName = "amarket"

# --- Funciones ---
function Check-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "Docker no parece estar instalado o en el PATH. Por favor, instálalo y asegúrate de que se esté ejecutando." -ForegroundColor Red
        exit 1
    }

    try {
        docker ps > $null
    } catch {
        Write-Host "El demonio de Docker no parece estar en ejecución. Por favor, inícialo." -ForegroundColor Red
        exit 1
    }
}

function Start-Database {
    $existingContainer = docker ps -a --filter "name=$containerName" --format "{{.Names}}"
    
    if ($existingContainer -eq $containerName) {
        $status = docker inspect --format '{{.State.Status}}' $containerName
        if ($status -eq "running") {
            Write-Host "El contenedor de la base de datos '$containerName' ya se está ejecutando." -ForegroundColor Green
        } else {
            Write-Host "El contenedor de la base de datos '$containerName' existe pero está detenido. Iniciando..." -ForegroundColor Yellow
            docker start $containerName
        }
    } else {
        Write-Host "Creando e iniciando un nuevo contenedor de base de datos '$containerName'..." -ForegroundColor Blue
        $dbInitSqlPath = Join-Path (Get-Location).Path "db\init.sql"
        
        if (-not (Test-Path $dbInitSqlPath)) {
            Write-Host "Error: No se encuentra el archivo db\init.sql en la ruta actual." -ForegroundColor Red
            exit 1
        }

        docker run -d `
            --name $containerName `
            -p "${dbPort}:5432" `
            -e "POSTGRES_USER=$dbUser" `
            -e "POSTGRES_PASSWORD=$dbPassword" `
            -e "POSTGRES_DB=$dbName" `
            -v "$dbInitSqlPath`:/docker-entrypoint-initdb.d/init.sql" `
            $dbImage
    }
    Write-Host "La base de datos debería estar disponible en unos momentos en localhost:$dbPort" -ForegroundColor Green
}

function Create-EnvFile {
    $envFilePath = ".env.local"
    if (Test-Path $envFilePath) {
        Write-Host "El archivo '$envFilePath' ya existe." -ForegroundColor Green
    } else {
        Write-Host "Creando el archivo de entorno '$envFilePath'..." -ForegroundColor Blue
$envContent = @"
# Generado por start-dev.ps1
# Base de datos (Local via Docker)
DATABASE_URL="postgresql://$dbUser`:$dbPassword`@localhost:$dbPort/$dbName"

# Autenticación JWT (Valores de desarrollo)
JWT_SECRET="change-this-to-a-secure-random-string-in-production"
SCHEMA_ADMIN_USER="admin"

# Hash para contraseñas (Valor de desarrollo)
HASH_SALT_KEY="change-this-to-a-secure-salt-key-in-production"

# Configuración de la app
NEXT_PUBLIC_APP_NAME="A-Market (Dev)"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@
        Set-Content -Path $envFilePath -Value $envContent
        Write-Host "'$envFilePath' creado exitosamente." -ForegroundColor Green
    }
}

# --- Ejecución ---
Write-Host "--- Iniciando entorno de desarrollo de A-Market ---"

# 1. Verificar Docker
Check-Docker

# 2. Iniciar Base de Datos
Start-Database

# 3. Crear .env.local
Create-EnvFile

# 4. Instalar dependencias
Write-Host "Instalando dependencias de npm... (esto puede tardar un momento)" -ForegroundColor Blue
npm install

# 5. Iniciar la aplicación
Write-Host "Iniciando el servidor de desarrollo... (npm run dev)" -ForegroundColor Blue
Write-Host "Puedes acceder a la aplicación en http://localhost:3000" -ForegroundColor Green
npm run dev

Write-Host "--- El script ha finalizado. El servidor de desarrollo puede seguir ejecutándose. ---"
