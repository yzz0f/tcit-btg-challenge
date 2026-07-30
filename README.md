# Gestión de Posts — Challenge Full Stack BTG/TCIT

Monorepo con una API NestJS y un frontend React para administrar Posts (crear, listar,
eliminar y filtrar). Persistencia en SQL Server, todo ejecutable en contenedores.

## Estructura

```
apps/
  api/       NestJS — arquitectura hexagonal (dominio / aplicación / infraestructura)
  web/       Vite + React + Redux Toolkit
packages/
  shared/    @tcit/shared — tipos y contratos compartidos entre api y web
infra/
  docker-compose.yml   SQL Server + api + web
  docker/              Dockerfiles y configuración de nginx
```

## Requisitos

- Node.js 22 (`.nvmrc`)
- npm 10+
- Docker (para SQL Server y el despliegue con compose)

## Puesta en marcha

```bash
npm install
cp .env.example .env     # ajustar credenciales locales
```

## Comandos

| Comando            | Descripción                         |
| ------------------ | ----------------------------------- |
| `npx nx serve api` | API en `http://localhost:3000/api`  |
| `npx nx serve web` | Frontend en `http://localhost:4200` |
| `npm run lint`     | ESLint en todos los proyectos       |
| `npm run test`     | Jest (api, shared) y Vitest (web)   |
| `npm run build`    | Build de los tres proyectos         |
| `npm run graph`    | Grafo de dependencias del monorepo  |

Verificación rápida de que la API responde:

```bash
curl http://localhost:3000/api/health
# {"status":"ok","service":"api"}
```

## Ejecución con Docker

Levanta SQL Server, la API y el frontend con un solo comando (requiere `.env` con `DB_PASSWORD`):

```bash
npm run docker:up      # build + up, espera a que los 3 servicios estén healthy
npm run docker:logs    # seguir logs
npm run docker:down    # detener (agregar -v para borrar los datos)
```

| Servicio    | URL / puerto                                      |
| ----------- | ------------------------------------------------- |
| `web`       | `http://localhost:8080`                           |
| `api`       | `http://localhost:3000/api` (y `/api` vía el web) |
| `sqlserver` | `localhost:1433`                                  |

Detalles de la infraestructura:

- El frontend se sirve con **nginx**, que además proxea `/api` hacia el contenedor de la API:
  el navegador usa un solo origen y no necesita CORS.
- La API se empaqueta con `nx run api:prune`, así la imagen final solo instala las
  dependencias que usa en runtime.
- `db-init` crea la base de datos si no existe; el esquema lo gestionan las migraciones.
- Los tres servicios tienen `healthcheck` y arrancan en orden (`sqlserver` → `db-init` →
  `api` → `web`).
- La imagen oficial de SQL Server solo publica `amd64`; en Apple Silicon corre emulada.

## Variables de entorno

Ver [.env.example](.env.example): conexión a SQL Server (`DB_*`), puerto y origen permitido
de la API (`API_PORT`, `WEB_ORIGIN`), URL del API para el frontend (`VITE_API_URL`) y puerto
del frontend en compose (`WEB_PORT`).

## API

| Método   | Ruta             | Descripción                      |
| -------- | ---------------- | -------------------------------- |
| `GET`    | `/api/health`    | Estado del servicio              |
| `GET`    | `/api/posts`     | Lista los posts                  |
| `POST`   | `/api/posts`     | Crea un post (genera el resumen) |
| `DELETE` | `/api/posts/:id` | Elimina un post                  |

> Los endpoints de `posts` se implementan sobre el módulo hexagonal de `apps/api`.
