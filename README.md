# A-Market: Sistema de Punto de Venta

A-Market es una aplicación web moderna diseñada como un sistema de punto de venta (POS), gestión de inventario y roles. Está construida con Next.js y sigue las mejores prácticas de desarrollo, incluyendo una arquitectura basada en el App Router.

## Tecnologías Principales

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Contenerización**: [Docker](https://www.docker.com/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: PostgreSQL
- **UI**: [React](https://react.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/UI](https://ui.shadcn.com/)
- **Autenticación**: Basada en JWT (JSON Web Tokens)
- **Testing**: Pruebas End-to-End con [Playwright](https://playwright.dev/)

## Primeros Pasos (Método Recomendado: Docker)

La forma más sencilla de levantar el proyecto localmente es usando Docker y Docker Compose. Esto creará contenedores para la aplicación y la base de datos PostgreSQL.

### 1. Prerrequisitos

-   [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/) instalados.

### 2. Configuración del Entorno

Abre el archivo `docker-compose.yml` y ajusta las variables de entorno para el servicio `app` si necesitas añadir claves de API u otros secretos.

```yaml
services:
  app:
    # ...
    environment:
      DATABASE_URL: "postgresql://user:password@db:5432/amarket"
      # Añade aquí otras variables de entorno que tu aplicación necesite
      # JWT_SECRET: "your-super-secret-jwt-key"
```

### 3. Levantar los Contenedores

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up --build
```

La aplicación estará disponible en `http://localhost:3000` y la base de datos en el puerto `5432`.

## Configuración Manual (Alternativa)

Si prefieres no usar Docker, puedes seguir estos pasos.

### 1. Prerrequisitos

-   Node.js (versión 20 o superior)
-   npm (o un gestor de paquetes equivalente)
-   Una instancia de PostgreSQL en ejecución.

### 2. Instalación y Configuración

1.  **Instala dependencias**:
    ```bash
    npm install
    ```
2.  **Configura el entorno**:
    Copia `.env.example` a `.env` y rellena las variables, incluyendo la URL de conexión a tu base de datos.
    ```bash
    copy .env.example .env
    ```
3.  **Inicializa la base de datos**:
    Ejecuta el script `db/init.sql` en tu instancia de PostgreSQL para crear las tablas necesarias.

4.  **Ejecuta la aplicación**:
    ```bash
    npm run dev
    ```

## Base de Datos

El esquema de la base de datos se define y se inicializa a través del script `db/init.sql`. Este script se ejecuta automáticamente al levantar el contenedor de la base de datos con Docker Compose.

Crea las siguientes tablas:
-   `users`: Almacena la información de los usuarios y sus roles.
-   `products`: Catálogo de productos.
-   `sales`: Registros de las ventas completadas.
-   `sale_items`: Detalle de los productos incluidos en cada venta.

Incluye un usuario de ejemplo:
-   **Email**: `admin@amarket.com`
-   **Rol**: `admin`

## Scripts Disponibles

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Compila la aplicación para producción.
-   `npm run start`: Inicia un servidor de producción.
-   `npm run lint`: Ejecuta el linter de ESLint.
-   `npm run test`: Ejecuta las pruebas end-to-end con Playwright.
-   `npm run test:ui`: Abre la UI de Playwright para pruebas interactivas.

## Autenticación

El sistema de autenticación utiliza JSON Web Tokens (JWT) almacenados en una cookie (`access_token`). Un middleware (`src/middleware.ts`) protege las rutas sensibles y redirige a los usuarios no autenticados a la página de login.
