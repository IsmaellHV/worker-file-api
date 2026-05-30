# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [Unreleased]

### Added

- `request_log` ahora guarda `ip` (`CF-Connecting-IP`) y `auth_user` (usuario de Basic auth, sin contraseña).

### Changed

- **Un bucket R2 por usuario** (antes un bucket compartido con prefijo). `USERS` mapea `usuario` → binding R2.
- **Amarre credencial ↔ bucket:** el `usuario` del body debe coincidir con el usuario autenticado (Basic); si no, `403`.

## [1.0.0] - 2026-05-30

### Added

- API de archivos sobre Cloudflare Workers + Hono.
- Almacenamiento en **Cloudflare R2** (`worker-file-bucket`), reemplazando AWS S3 del proyecto `file-server`.
- Endpoints: `upload` (multipart), `download` (stream), `downloadBase64`, `getSize`.
- Mapeo `usuario` → prefijo de carpeta vía `USERS`.
- Seguridad de 3 capas: filtro de IP (`CF-Connecting-IP`), whitelist de dominios (Origin/CORS) y Basic auth.
- Auditoría en **D1** (`worker-file-db`): `file_log` (por operación) y `request_log` (por request, con body JSON).
- Dominio propio con SSL: `worker-file.ihurtadov.com`.
- Validación manual (sin AJV, incompatible con Workers).
