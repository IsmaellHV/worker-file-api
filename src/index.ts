import { Bindings } from './env';
import { RouterRest } from './rest/Router';
import { ServerREST } from './rest/Server';
import { AdapterRequestLog } from './context/shared/Infraestructure/AdapterRequestLog';
import { AdapterRetention } from './context/shared/Infraestructure/AdapterRetention';

const RETENTION_DAYS = 365;

let appPromise: Promise<any> | null = null;

const run = async (env: { [key: string]: Bindings }) => {
  const rutas: RouterRest = new RouterRest();
  await rutas.exec();

  const server: ServerREST = new ServerREST();
  await server.exec();
  server.app.route(`/api/${env.PREFIX}`, rutas.router);
  await server.middlewareNotFound();
  return server.app;
};

export default {
  async fetch(request: Request, env: { [key: string]: Bindings }, ctx: ExecutionContext) {
    if (!appPromise) appPromise = run(env);
    const app = await appPromise;

    const db = (env as unknown as Bindings).DB_LOG as unknown as D1Database;

    // Clonar el body ANTES de que app.fetch lo consuma (el body solo se lee una vez).
    // Solo registramos el body en JSON; archivos binarios (multipart) se omiten para no inflar el log.
    let body: string | null = null;
    if (db && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          const raw = await request.clone().text();
          body = raw ? raw.slice(0, 10000) : null; // truncado a 10KB
        } catch {
          body = null;
        }
      } else if (contentType.includes('multipart/form-data')) {
        body = '[multipart/form-data omitido]';
      }
    }

    const start = Date.now();
    const res: Response = await app.fetch(request, env, ctx);

    if (db) {
      let error: string | null = null;
      if (res.status >= 400) {
        try {
          error = await res.clone().text();
        } catch {
          error = null;
        }
      }
      const url = new URL(request.url);
      // Extrae el usuario de Basic auth (sin la contraseña) para auditoría.
      let authUser: string | null = null;
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2 && parts[0].trim().toUpperCase() === 'BASIC') {
          try {
            const dec = atob(parts[1].trim());
            const i = dec.indexOf(':');
            authUser = i >= 0 ? dec.slice(0, i) : null;
          } catch {
            authUser = null;
          }
        }
      }
      ctx.waitUntil(
        AdapterRequestLog.save(db, {
          method: request.method,
          path: url.pathname,
          status: res.status,
          ip: request.headers.get('cf-connecting-ip'),
          authUser,
          origin: request.headers.get('origin') || request.headers.get('host'),
          userAgent: request.headers.get('user-agent'),
          body,
          error,
          durationMs: Date.now() - start,
        }),
      );
    }

    return res;
  },

  // Cron Trigger: limpia logs viejos para no llenar D1 (ver wrangler.jsonc → triggers.crons).
  async scheduled(_event: ScheduledController, env: { [key: string]: Bindings }, ctx: ExecutionContext) {
    const db = (env as unknown as Bindings).DB_LOG as unknown as D1Database;
    ctx.waitUntil(AdapterRetention.purge(db, ['request_log', 'file_log'], RETENTION_DAYS));
  },
};
