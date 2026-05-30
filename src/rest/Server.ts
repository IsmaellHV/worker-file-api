import { Context, Hono, Next } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { UAParser } from 'ua-parser-js';
import { IError } from '../types/IError';
import { cors } from 'hono/cors';
import { Bindings, getEnvironment } from '../env';

export class ServerREST {
  public app: Hono<{ Bindings: Bindings }>;

  constructor() {}

  public async exec() {
    this.app = await this.createServer();
    await this.configurePlugins();
    await this.middlewareValidator();
    await this.middlewareError();
    return this.app;
  }

  private async createServer() {
    const app = new Hono<{ Bindings: Bindings }>();
    return app;
  }

  private async configurePlugins() {
    this.app.use('*', async (c: Context, next: Next) => {
      const ENVIRONMENT = getEnvironment(c);
      const allowedOrigin = (origin: string) => {
        return ENVIRONMENT.DOMAINS.filter((x) => origin.includes(x)).length ? true : false;
      };

      // Filtro por IP (CF-Connecting-IP lo inyecta Cloudflare; no existe en `wrangler dev` local).
      // Si ALLOWED_IPS está vacío, no se aplica el filtro (útil en desarrollo).
      if (ENVIRONMENT.ALLOWED_IPS.length) {
        const clientIp = c.req.header('cf-connecting-ip') || '';
        if (!ENVIRONMENT.ALLOWED_IPS.includes(clientIp)) {
          return c.json({ error: true, errorDescription: 'IP no permitida', errorCode: 0, message: 'IP no permitida' }, 403);
        }
      }

      // Obtiene el origen de la petición
      const requestOrigin = c.req.raw.headers.get('origin') || c.req.header('host') || '';
      const originResult = allowedOrigin(requestOrigin);

      if (!originResult) {
        return c.json({ error: true, errorDescription: 'Origen no permitido', errorCode: 0, message: 'Origen no permitido' }, 403);
      }

      const corsOptions = {
        origin: (origin: string, c: Context) => {
          return ENVIRONMENT.DOMAINS.filter((x) => origin.includes(x)).length ? origin : '';
        },
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length'],
        credentials: true,
      };
      return await cors(corsOptions)(c, next);
    });
  }

  private middlewareValidator() {
    this.app.use(async (c: Context, next: Next) => {
      const userAgent = c.req.header('User-Agent') || '';
      const parser = new UAParser(userAgent);
      const uaResult = parser.getResult();
      c.set('agente', uaResult);
      c.set('authBasic', false);
      c.set('authJWT', false);

      const authorization = c.req.header('Authorization');
      if (authorization) {
        const Param = authorization.split(' ');
        if (Param.length === 1) Param.unshift('BEARER');
        if (Param.length === 2) {
          switch (Param[0].trim().toUpperCase()) {
            case 'BASIC':
              c.set('authBasic', true);
              break;
            case 'BEARER':
              c.set('authJWT', true);
              break;
          }
        }
      }
      await next();
    });
  }

  private middlewareError() {
    this.app.onError(async (err, c) => {
      const error = err as IError;

      error.message = error.message || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';
      error.statusHttp = error.statusHttp || 500;
      error.errorCode = error.errorCode || 0;
      error.messageClient = error.messageClient || 'Se produjo un error. Por favor, inténtelo de nuevo más tarde';

      return c.json(
        {
          error: true,
          errorDescription: error.messageClient,
          errorCode: error.errorCode,
          message: error.message,
        },
        error.statusHttp as ContentfulStatusCode,
      );
    });

    // notFound: Manejo de rutas inexistentes (reemplaza middlewareNotFound)
    this.app.notFound(async (c) => {
      const error = new IError('EndPoint not found', 0, 404, 'Servicio no encontrado');

      return c.json(
        {
          error: true,
          errorDescription: error.messageClient,
          errorCode: error.errorCode,
          message: error.message,
        },
        error.statusHttp as ContentfulStatusCode,
      );
    });
  }

  public async middlewareNotFound() {
    this.app.notFound((c: Context) => {
      try {
        throw new IError('EndPoint not found', 0, 404, 'Servicio no encontrado');
      } catch (err) {
        const error = err as IError;
        error.message = err.message || 'EndPoint not found';
        error.statusHttp = err.statusHttp || 500;
        error.errorCode = err.errorCode || 0;
        error.messageClient = err.messageClient || 'Servicio no encontrado';

        return c.json({ error: true, errorDescription: error.messageClient, errorCode: error.errorCode, message: error.message }, error.statusHttp as ContentfulStatusCode);
      }
    });
  }
}
