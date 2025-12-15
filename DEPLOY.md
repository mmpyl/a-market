# Guía de Despliegue - A-Market

Esta guía te ayudará a desplegar A-Market usando Docker tanto en desarrollo local como en producción.

## 📋 Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) instalado (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (versión 2.0 o superior)

Para verificar que tienes Docker instalado correctamente:

```bash
docker --version
docker-compose --version
```

## 🚀 Despliegue Local (Desarrollo)

### 1. Configuración Inicial

Clona el repositorio y navega al directorio del proyecto:

```bash
cd c:\laragon\www\a-market
```

### 2. Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml`. Para desarrollo local, las configuraciones por defecto funcionarán, pero **DEBES cambiar los secretos para producción**.

**Variables críticas a cambiar en producción:**
- `JWT_SECRET`: Usa un string aleatorio seguro
- `HASH_SALT_KEY`: Usa un salt key seguro
- `RESEND_API_KEY`: Si usas email, añade tu API key de Resend

### 3. Levantar los Servicios

Ejecuta el siguiente comando para construir y levantar todos los servicios:

```bash
docker-compose up --build
```

O en modo detached (segundo plano):

```bash
docker-compose up -d --build
```

### 4. Verificar el Despliegue

Una vez que los contenedores estén corriendo:

- **Aplicación Web**: http://localhost:3000
- **Base de Datos PostgreSQL**: Puerto 5432

**Credenciales por defecto:**
- Email: `admin@amarket.com`
- Rol: `admin`

### 5. Ver Logs

Para ver los logs de la aplicación:

```bash
# Todos los servicios
docker-compose logs -f

# Solo la app
docker-compose logs -f app

# Solo la base de datos
docker-compose logs -f db
```

## 🏭 Despliegue en Producción

### 1. Seguridad

> [!CAUTION]
> **NUNCA uses las credenciales por defecto en producción**

Antes de desplegar en producción, asegúrate de:

1. **Cambiar las variables de entorno sensibles** en `docker-compose.yml`:
   ```yaml
   JWT_SECRET: "tu-secreto-jwt-muy-seguro-y-aleatorio"
   HASH_SALT_KEY: "tu-salt-key-muy-seguro-y-aleatorio"
   ```

2. **Cambiar las credenciales de PostgreSQL**:
   ```yaml
   POSTGRES_USER: tu_usuario_seguro
   POSTGRES_PASSWORD: tu_contraseña_muy_segura
   POSTGRES_DB: amarket_prod
   ```

3. **Actualizar DATABASE_URL** con las nuevas credenciales:
   ```yaml
   DATABASE_URL: "postgresql://tu_usuario_seguro:tu_contraseña_muy_segura@db:5432/amarket_prod"
   ```

4. **Configurar el dominio correcto**:
   ```yaml
   NEXT_PUBLIC_APP_URL: "https://tu-dominio.com"
   ```

### 2. Usar Archivo .env (Recomendado)

En lugar de poner las variables directamente en `docker-compose.yml`, crea un archivo `.env`:

```bash
# .env
DATABASE_URL=postgresql://usuario:password@db:5432/amarket
JWT_SECRET=tu-secreto-muy-seguro
HASH_SALT_KEY=tu-salt-muy-seguro
RESEND_API_KEY=tu-api-key
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

Y actualiza `docker-compose.yml` para usar `env_file`:

```yaml
services:
  app:
    build: .
    env_file:
      - .env
    # ... resto de la configuración
```

### 3. Exponer la Aplicación

Para producción, necesitarás configurar:

- **Reverse Proxy** (Nginx, Traefik, Caddy)
- **Certificado SSL** (Let's Encrypt)
- **Firewall** y reglas de seguridad

Ejemplo con Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina datos de la BD)
docker-compose down -v

# Reiniciar servicios
docker-compose restart

# Reiniciar solo la app
docker-compose restart app

# Reconstruir sin caché
docker-compose build --no-cache

# Ver estado de los contenedores
docker-compose ps
```

### Acceso a Contenedores

```bash
# Acceder a la shell del contenedor de la app
docker-compose exec app sh

# Acceder a PostgreSQL
docker-compose exec db psql -U user -d amarket

# Ver logs en tiempo real
docker-compose logs -f app
```

### Base de Datos

```bash
# Backup de la base de datos
docker-compose exec db pg_dump -U user amarket > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U user amarket < backup.sql

# Conectarse a la base de datos
docker-compose exec db psql -U user -d amarket
```

## 🐛 Troubleshooting

### Problema: Error al conectar a la base de datos

**Solución**: Verifica que el servicio de base de datos esté saludable:

```bash
docker-compose logs db
docker-compose exec db pg_isready -U user -d amarket
```

### Problema: Puerto 3000 ya está en uso

**Solución**: Cambia el puerto en `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Cambia 3001 por el puerto que prefieras
```

### Problema: La aplicación no se construye

**Solución**: Limpia el caché y reconstruye:

```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### Problema: Cambios en el código no se reflejan

**Solución**: Reconstruye la imagen:

```bash
docker-compose up --build
```

### Problema: Error "standalone server not found"

**Solución**: Asegúrate de que `next.config.js` tiene `output: 'standalone'`:

```javascript
module.exports = {
  output: 'standalone',
  // ...
};
```

## 📊 Monitoreo

Para monitorear el uso de recursos:

```bash
# Ver uso de CPU y memoria
docker stats

# Ver solo la app
docker stats a-market-app-1
```

## 🔄 Actualización de la Aplicación

Para actualizar la aplicación con nuevos cambios:

```bash
# 1. Detener los servicios
docker-compose down

# 2. Obtener los últimos cambios (si usas git)
git pull

# 3. Reconstruir y levantar
docker-compose up --build -d

# 4. Verificar los logs
docker-compose logs -f app
```

## 📝 Notas Adicionales

- **Volúmenes**: Los datos de PostgreSQL se persisten en el volumen `postgres_data`
- **Backups**: Realiza backups regulares de tu base de datos en producción
- **Logs**: Configura rotación de logs para evitar que ocupen mucho espacio
- **Seguridad**: Mantén Docker y las imágenes actualizadas

## 🆘 Soporte

Si encuentras problemas no cubiertos en esta guía, revisa:

1. Los logs: `docker-compose logs -f`
2. El estado de los contenedores: `docker-compose ps`
3. Los recursos del sistema: `docker stats`
