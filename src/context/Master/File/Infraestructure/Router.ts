import { Hono, Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { IError } from '../../../../types/IError';
import { AdapterAuthorization } from '../../../shared/Infraestructure/AdapterAuthorization';
import { AdapterConfigure } from './AdapterConfigure';
import { Controller } from './Controller';
import { EntityUpload } from '../Domain/EntityUpload';
import { EntityDownload } from '../Domain/EntityDownload';
import { EntityFileUpload } from '../Domain/EntityFileUpload';

export class Router {
  private controller: Controller;
  public router: Hono;

  constructor() {
    this.router = new Hono();
    this.controller = new Controller();
  }

  public async exec(): Promise<void> {
    const base = `/${AdapterConfigure.SCHEMA}/${AdapterConfigure.ENTITY}`;
    this.router.post(`${base}/upload`, this.uploadFile.bind(this));
    this.router.post(`${base}/download`, this.downloadFile.bind(this));
    this.router.post(`${base}/downloadBase64`, this.downloadFileBase64.bind(this));
    this.router.post(`${base}/getSize`, this.getSizeFile.bind(this));
  }

  private async uploadFile(c: Context): Promise<Response> {
    try {
      await AdapterAuthorization.validateAuthBasic(c);

      const form = await c.req.formData();
      const raw = form.get('file');
      if (!raw || typeof raw === 'string') throw new IError('Indicar archivo', 0);

      const blob = raw as unknown as File;
      const buffer = await blob.arrayBuffer();
      if (!buffer.byteLength) throw new IError(`No se permiten archivos vacíos, por favor verifique el archivo que está intentando subir (${blob.name}: 0kb)`, 0);

      const directorioRaw = (form.get('directorio') as string) ?? '';
      const body: EntityUpload = {
        directorio: directorioRaw.includes(',') ? directorioRaw.split(',') : directorioRaw,
        nombreArchivo: ((form.get('nombreArchivo') as string) || blob.name) ?? '',
        usuario: (form.get('usuario') as string) ?? '',
      };

      const file: EntityFileUpload = {
        originalname: blob.name,
        mimetype: blob.type || 'application/octet-stream',
        size: buffer.byteLength,
        buffer,
      };

      const result = await this.controller.uploadFile(c, body, file);
      return c.json(result, 200);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  private async downloadFile(c: Context): Promise<Response> {
    try {
      await AdapterAuthorization.validateAuthBasic(c);
      const body: EntityDownload = await c.req.json();
      const object = await this.controller.downloadFile(c, body);

      return new Response(object.body, {
        status: 200,
        headers: {
          'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
          'Content-Length': `${object.size}`,
          'Content-Disposition': `attachment; filename="${body.nombreArchivo}"`,
        },
      });
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  private async downloadFileBase64(c: Context): Promise<Response> {
    try {
      await AdapterAuthorization.validateAuthBasic(c);
      const body: EntityDownload = await c.req.json();
      const object = await this.controller.downloadFile(c, body);

      const buffer = await object.arrayBuffer();
      const base64Data = this.arrayBufferToBase64(buffer);
      return c.json({ base64Data }, 200);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  private async getSizeFile(c: Context): Promise<Response> {
    try {
      await AdapterAuthorization.validateAuthBasic(c);
      const body: EntityDownload = await c.req.json();
      const size = await this.controller.getSizeFile(c, body);
      return c.json(size, 200);
    } catch (error) {
      return this.handleError(c, error);
    }
  }

  private handleError(c: Context, error: unknown): Response {
    const err = error as IError;
    return c.json(
      { error: true, errorDescription: err.messageClient || err.message, errorCode: err.errorCode ?? 0, message: err.message },
      (err.statusHttp ?? 406) as ContentfulStatusCode,
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as unknown as number[]);
    }
    return btoa(binary);
  }
}
