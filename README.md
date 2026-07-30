# Gestión de Posts — Challenge Full Stack BTG/TCIT

Monorepo con una API NestJS y un frontend React para administrar Posts (crear, listar,
eliminar y filtrar). Persistencia en SQL Server, todo ejecutable en contenedores.

## Estructura

```
apps/
  api/       NestJS — arquitectura hexagonal
    src/modules/posts/
      domain/           Post, puertos (repositorio, summarizer) y errores de dominio
      application/      casos de uso: CreatePost, ListPosts, DeletePost
      infrastructure/   repositorio TypeORM, summarizer, controlador y DTOs
    src/migrations/     migraciones de TypeORM
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

| Método   | Ruta             | Respuesta                                               |
| -------- | ---------------- | ------------------------------------------------------- |
| `GET`    | `/api/health`    | `200` — estado del servicio                             |
| `GET`    | `/api/posts`     | `200` — posts del más reciente al más antiguo           |
| `POST`   | `/api/posts`     | `201` — post creado; `400` si el payload no es válido   |
| `DELETE` | `/api/posts/:id` | `204`; `404` si no existe; `400` si el id no es un UUID |

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/api/posts \
  -H 'Content-Type: application/json' \
  -d '{"name":"Despliegue","description":"El despliegue usa contenedores en la nube."}'
```

```json
{
  "id": "349c31d4-b364-46bc-bed9-2c7bf450c736",
  "name": "Despliegue",
  "description": "El despliegue usa contenedores en la nube.",
  "summary": "El despliegue usa contenedores en la nube. Palabras clave: contenedores, despliegue, nube",
  "createdAt": "2026-07-30T03:03:49.688Z"
}
```

## Dominio y persistencia

- El módulo `posts` sigue una **arquitectura hexagonal**: los casos de uso dependen de los
  puertos `PostRepositoryPort` y `SummarizerPort`, y los adaptadores concretos
  (`TypeOrmPostRepository`, `KeywordSummarizer`) se enchufan en `posts.module.ts`.
- El `summary` se genera solo al crear el post: primera oración de la descripción más las
  palabras clave más frecuentes. Cambiarlo por un LLM implica un adaptador nuevo del puerto.
- El esquema lo definen las **migraciones de TypeORM** (`synchronize` está desactivado) y se
  aplican al arrancar la API, así que el contenedor queda listo sin pasos manuales.
