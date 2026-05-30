import { Context } from 'hono';
import { EntityUpload } from './EntityUpload';
import { EntityDownload } from './EntityDownload';
import { EntityFileUpload } from './EntityFileUpload';

export interface RepositoryMain {
  validateUpload(params: EntityUpload): Promise<void>;
  validateDownload(params: EntityDownload): Promise<void>;
  uploadFileR2(c: Context, body: EntityUpload, file: EntityFileUpload): Promise<boolean>;
  downloadFileR2(c: Context, body: EntityDownload): Promise<R2ObjectBody>;
  getSizeR2(c: Context, body: EntityDownload): Promise<number>;
}
