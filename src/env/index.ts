import type { Context } from 'hono';

export type Bindings = {
  PREFIX: string;
  DOMAINS: string;
  ALLOWED_IPS: string;
  AUTH_BASIC: string;
  USERS: string;
  DB_LOG: D1Database;
  // Un binding R2 por usuario (ej. BUCKET_FILER). Se resuelve dinámicamente por nombre.
  [binding: string]: R2Bucket | D1Database | string;
};

export interface IAuthBasic {
  usr: string;
  pwd: string;
}

export interface IUserBucket {
  user: string;
  bucket: string; // nombre del binding R2 declarado en wrangler.jsonc (ej. "BUCKET_FILER")
  path?: string[]; // prefijo opcional dentro del bucket
}

export const getEnvironment = (c: Context<{ Bindings: Bindings }>) => ({
  PREFIX: (c.env.PREFIX as string) || '',
  DOMAINS: c.env.DOMAINS ? JSON.parse(c.env.DOMAINS as string) : [],
  ALLOWED_IPS: (c.env.ALLOWED_IPS ? JSON.parse(c.env.ALLOWED_IPS as string) : []) as string[],
  AUTH_BASIC: (c.env.AUTH_BASIC ? JSON.parse(c.env.AUTH_BASIC as string) : []) as IAuthBasic[],
  USERS: (c.env.USERS ? JSON.parse(c.env.USERS as string) : []) as IUserBucket[],
});
