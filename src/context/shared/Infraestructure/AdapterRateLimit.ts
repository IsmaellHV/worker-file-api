import { IError } from '../../../types/IError';

interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export class AdapterRateLimit {
  // Lanza 429 si se excede el límite para `key`.
  // Si el binding no existe (p. ej. config local sin limiter), no aplica el límite.
  public static async check(limiter: RateLimiter | undefined, key: string): Promise<void> {
    if (!limiter || typeof limiter.limit !== 'function') return;
    const { success } = await limiter.limit({ key });
    if (!success) {
      throw new IError('Demasiadas solicitudes, intente nuevamente en unos segundos', 0, 429, 'Demasiadas solicitudes');
    }
  }
}
