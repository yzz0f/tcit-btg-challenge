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

## Variables de entorno

Ver [.env.example](.env.example): conexión a SQL Server (`DB_*`), puerto y origen permitido
de la API (`API_PORT`, `WEB_ORIGIN`) y URL del API para el frontend (`VITE_API_URL`).

## API

| Método   | Ruta             | Descripción                      |
| -------- | ---------------- | -------------------------------- |
| `GET`    | `/api/health`    | Estado del servicio              |
| `GET`    | `/api/posts`     | Lista los posts                  |
| `POST`   | `/api/posts`     | Crea un post (genera el resumen) |
| `DELETE` | `/api/posts/:id` | Elimina un post                  |

> Los endpoints de `posts` se implementan sobre el módulo hexagonal de `apps/api`.
