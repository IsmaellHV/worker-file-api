import { Context } from 'hono';
import { IError } from '../../../../types/IError';
import { getEnvironment, IUserBucket } from '../../../../env';
import { AdapterR2 } from '../../../shared/Infraestructure/AdapterR2';
import { AdapterFileLog } from '../../../shared/Infraestructure/AdapterFileLog';
import { EntityUpload } from '../Domain/EntityUpload';
import { EntityDownload } from '../Domain/EntityDownload';
import { EntityFileUpload } from '../Domain/EntityFileUpload';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class RepositoryMainImpl implements RepositoryMain {
  public async validateUpload(params: EntityUpload): Promise<void> {
    this.validateCommon(params);
  }

  public async validateDownload(params: EntityDownload): Promise<void> {
    this.validateCommon(params);
  }

  public async uploadFileR2(c: Context, body: EntityUpload, file: EntityFileUpload): Promise<boolean> {
    const { bucket, db, origin, key } = this.resolve(c, body);
    try {
      await AdapterR2.upload(bucket, key, file.buffer, file.mimetype);
      await AdapterFileLog.save(db, { action: 'upload', key, usuario: body.usuario, size: file.size, status: 'ok', origin });
      return true;
    } catch (err) {
      await AdapterFileLog.save(db, { action: 'upload', key, usuario: body.usuario, size: file.size, status: 'failed', error: (err as Error)?.message ?? 'unknown', origin });
      throw err;
    }
  }

  public async downloadFileR2(c: Context, body: EntityDownload): Promise<R2ObjectBody> {
    const { bucket, db, origin, key } = this.resolve(c, body);
    try {
      const object = await AdapterR2.download(bucket, key);
      await AdapterFileLog.save(db, { action: 'download', key, usuario: body.usuario, size: object.size, status: 'ok', origin });
      return object;
    } catch (err) {
      await AdapterFileLog.save(db, { action: 'download', key, usuario: body.usuario, size: null, status: 'failed', error: (err as Error)?.message ?? 'unknown', origin });
      throw err;
    }
  }

  public async getSizeR2(c: Context, body: EntityDownload): Promise<number> {
    const { bucket, db, origin, key } = this.resolve(c, body);
    try {
      const size = await AdapterR2.getSize(bucket, key);
      await AdapterFileLog.save(db, { action: 'getSize', key, usuario: body.usuario, size, status: 'ok', origin });
      return size;
    } catch (err) {
      await AdapterFileLog.save(db, { action: 'getSize', key, usuario: body.usuario, size: null, status: 'failed', error: (err as Error)?.message ?? 'unknown', origin });
      throw err;
    }
  }

  /** Resuelve el bucket del usuario (un bucket por usuario) y arma la key del objeto. */
  private resolve(c: Context, body: EntityUpload | EntityDownload) {
    const ENVIRONMENT = getEnvironment(c);
    const db = c.env.DB_LOG as unknown as D1Database;
    const origin = c.req.header('origin') || c.req.header('host') || null;

    const cred: IUserBucket | undefined = ENVIRONMENT.USERS.find((x) => x.user === body.usuario);
    if (!cred) throw new IError('Usuario/Contraseña erróneo', 0, 403);

    const bucket = c.env[cred.bucket] as unknown as R2Bucket;
    if (!bucket) throw new IError('Almacenamiento no configurado para el usuario', 0, 500);

    const directorio = Array.isArray(body.directorio) ? body.directorio : `${body.directorio}`.split(',');
    const key = AdapterR2.buildKey(cred.path || [], directorio, body.nombreArchivo);

    return { bucket, db, origin, key };
  }

  private validateCommon(params: EntityUpload | EntityDownload): void {
    const dirOk = Array.isArray(params.directorio) ? params.directorio.length > 0 : this.isNonEmptyString(params.directorio);
    if (!dirOk) throw new IError('parámetros de ingreso no presenta la propiedad directorio', 0);
    if (!this.isNonEmptyString(params.nombreArchivo)) throw new IError('parámetros de ingreso no presenta la propiedad nombreArchivo', 0);
    if (!this.isNonEmptyString(params.usuario)) throw new IError('parámetros de ingreso no presenta la propiedad usuario', 0);
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }
}
