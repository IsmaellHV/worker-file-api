import { IError } from '../../../types/IError';

export class AdapterR2 {
  /** Construye la key del objeto: prefijo + directorio + nombreArchivo */
  public static buildKey(path: string[], directorio: string[], fileName: string): string {
    return [...path, ...directorio, fileName].filter((x) => x !== undefined && x !== null && `${x}`.length).join('/');
  }

  public static async upload(bucket: R2Bucket, key: string, buffer: ArrayBuffer, contentType?: string): Promise<boolean> {
    await bucket.put(key, buffer, {
      httpMetadata: contentType ? { contentType } : undefined,
    });
    return true;
  }

  public static async download(bucket: R2Bucket, key: string): Promise<R2ObjectBody> {
    const object = await bucket.get(key);
    if (!object) throw new IError('Sin Archivo', 0, 404, 'Archivo no encontrado');
    return object;
  }

  public static async getSize(bucket: R2Bucket, key: string): Promise<number> {
    const object = await bucket.head(key);
    if (!object) throw new IError('Sin Archivo', 0, 404, 'Archivo no encontrado');
    return object.size;
  }
}
