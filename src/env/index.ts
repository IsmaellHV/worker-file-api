import type { Context } from 'hono';

export type Bindings = {
  PREFIX: string;
  DOMAINS: string;
  ALLOWED_IPS: string;
  AUTH_BASIC: string;
  USERS: string;
  DB_LOG: D1Database;
  BUCKET: R2Bucket;
};

export interface IAuthBasic {
  usr: string;
  pwd: string;
}

export interface IUserPath {
  user: string;
  path: string[];
}

export const getEnvironment = (c: Context<{ Bindings: Bindings }>) => ({
  PREFIX: c.env.PREFIX || '',
  DOMAINS: c.env.DOMAINS ? JSON.parse(c.env.DOMAINS) : [],
  ALLOWED_IPS: (c.env.ALLOWED_IPS ? JSON.parse(c.env.ALLOWED_IPS) : []) as string[],
  AUTH_BASIC: (c.env.AUTH_BASIC ? JSON.parse(c.env.AUTH_BASIC) : []) as IAuthBasic[],
  USERS: (c.env.USERS ? JSON.parse(c.env.USERS) : []) as IUserPath[],
});
