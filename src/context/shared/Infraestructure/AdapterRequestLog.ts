export interface IRequestLogRow {
  method: string;
  path: string;
  status: number;
  ip: string | null;
  authUser: string | null;
  origin: string | null;
  userAgent: string | null;
  body: string | null;
  error: string | null;
  durationMs: number;
}

export class AdapterRequestLog {
  public static async save(db: D1Database | undefined, row: IRequestLogRow): Promise<void> {
    if (!db) return;
    try {
      await db
        .prepare('INSERT INTO request_log (method, path, status, ip, auth_user, origin, user_agent, body, error, duration_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(row.method, row.path, row.status, row.ip, row.authUser, row.origin, row.userAgent, row.body, row.error, row.durationMs)
        .run();
    } catch (e) {
      console.error('request_log save failed:', e);
    }
  }
}
