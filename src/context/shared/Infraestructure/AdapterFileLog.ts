export interface IFileLogRow {
  action: 'upload' | 'download' | 'getSize';
  key: string | null;
  usuario: string | null;
  size: number | null;
  status: 'ok' | 'failed';
  error?: string | null;
  origin?: string | null;
}

export class AdapterFileLog {
  public static async save(db: D1Database | undefined, row: IFileLogRow): Promise<void> {
    if (!db) return;
    try {
      await db
        .prepare('INSERT INTO file_log (action, file_key, usuario, size, status, error, origin) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(row.action, row.key, row.usuario, row.size ?? null, row.status, row.error ?? null, row.origin ?? null)
        .run();
    } catch (e) {
      console.error('file_log save failed:', e);
    }
  }
}
