# worker-file-api

API de almacenamiento de archivos construida con [Hono](https://hono.dev) sobre **Cloudflare Workers**, usando **Cloudflare R2** como almacenamiento de objetos y **D1** para auditoría. Hermano de [`worker-mailer-api`](../worker-mailer-api) y misma arquitectura (Clean / Hexagonal).

- **Producción:** `https://worker-file.ihurtadov.com`
- **Base path:** `/api/${PREFIX}` → `/api/ihv`

## Arquitectura

```
src/
├── index.ts                  # Entry del Worker + logging de cada request (D1)
├── env/                      # Bindings y getEnvironment()
├── rest/                     # Server (Hono) + Router + middlewares
├── types/IError.ts
└── context/
    ├── Master/File/          # Dominio "File" (Application/Domain/Infraestructure)
    └── shared/Infraestructure/
        ├── AdapterAuthorization.ts   # Basic auth (atob)
        ├── AdapterR2.ts              # Wrapper de R2 (put/get/head)
        ├── AdapterFileLog.ts         # Log por operación de archivo (D1 file_log)
        └── AdapterRequestLog.ts      # Log por request HTTP (D1 request_log)
```

> Adaptado del proyecto Express `file-server` (AWS S3 + multer) a Workers: **R2 reemplaza S3**, no hay `fs`/`Buffer` de Node, no se usa AJV (validación manual).

## Endpoints

Todos requieren **Basic auth** y `Origin` permitido. Base: `/api/ihv/master/file`.

| Método | Path             | Body                                                   | Respuesta            |
| ------ | ---------------- | ------------------------------------------------------ | -------------------- |
| POST   | `/upload`        | `multipart/form-data`: `file`, `usuario`, `directorio`, `nombreArchivo` | `true`               |
| POST   | `/download`      | JSON: `{ usuario, directorio, nombreArchivo }`         | binario (stream)     |
| POST   | `/downloadBase64`| JSON: `{ usuario, directorio, nombreArchivo }`         | `{ base64Data }`     |
| POST   | `/getSize`       | JSON: `{ usuario, directorio, nombreArchivo }`         | `number` (bytes)     |

- `directorio`: array (`["docs","2026"]`) o string separado por comas (`"docs,2026"`).
- **Un bucket R2 por usuario** (aislamiento total): cada `usuario` se mapea a su propio bucket vía `USERS`.
- La key del objeto en R2 es: `<path-opcional>/<directorio>/<nombreArchivo>` (el `path` por defecto es vacío, ya que el bucket en sí aísla al usuario).

## Seguridad (3 capas)

1. **IP** — `ALLOWED_IPS` valida `CF-Connecting-IP` (no falsificable; lo inyecta Cloudflare). Vacío = sin filtro (dev).
2. **Dominio** — `DOMAINS` valida el `Origin`/`Host` (CORS; falsificable, solo barrera de navegador).
3. **Basic auth** — `AUTH_BASIC` (secreto). Real garantía de acceso.

`USERS` mapea cada `usuario` a su **propio bucket R2** (`bucket` = nombre del binding) y, opcionalmente, a un prefijo (`path`).

### Agregar un usuario nuevo

1. Crear su bucket: `npx wrangler r2 bucket create worker-file-<user>`
2. Añadir binding en `wrangler.jsonc` → `{ "binding": "BUCKET_<USER>", "bucket_name": "worker-file-<user>" }`
3. Añadir credencial en `AUTH_BASIC` y entrada en `USERS`: `{ "user": "<user>", "bucket": "BUCKET_<USER>", "path": [] }`
4. `npm run deploy` y actualizar los secrets `AUTH_BASIC` y `USERS`.

## Variables / Secrets

Local en `.dev.vars` (gitignored), producción con `wrangler secret put`:

```
PREFIX=ihv
DOMAINS=["ismaelhv.com","ihurtadov.com","localhost"]
ALLOWED_IPS=["137.184.115.148","38.25.80.239"]
AUTH_BASIC=[{"usr":"filer","pwd":"***"}]
USERS=[{"user":"filer","bucket":"BUCKET_FILER","path":[]}]
```

Bindings en `wrangler.jsonc`: `BUCKET_FILER` (R2 `worker-file-bucket`, uno por usuario), `DB_LOG` (D1 `worker-file-db`).

## Desarrollo

```bash
npm install
npm run dev          # wrangler dev (ALLOWED_IPS=[] en local)
npm run type-check
npm run deploy       # wrangler deploy --minify
```

Schema D1: `npx wrangler d1 execute worker-file-db --remote --file=./schema.sql`

## Ejemplos curl

```bash
# Subir
curl -X POST https://worker-file.ihurtadov.com/api/ihv/master/file/upload \
  -H "Origin: https://ismaelhv.com" -u "filer:***" \
  -F "usuario=filer" -F "directorio=docs,2026" \
  -F "nombreArchivo=prueba.txt" -F "file=@./prueba.txt;type=text/plain"

# Tamaño
curl -X POST https://worker-file.ihurtadov.com/api/ihv/master/file/getSize \
  -H "Content-Type: application/json" -H "Origin: https://ismaelhv.com" -u "filer:***" \
  -d '{"usuario":"filer","directorio":["docs","2026"],"nombreArchivo":"prueba.txt"}'

# Descargar
curl -X POST https://worker-file.ihurtadov.com/api/ihv/master/file/download \
  -H "Content-Type: application/json" -H "Origin: https://ismaelhv.com" -u "filer:***" \
  -d '{"usuario":"filer","directorio":["docs","2026"],"nombreArchivo":"prueba.txt"}' -o salida.txt
```
