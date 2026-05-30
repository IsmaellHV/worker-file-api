import { Context } from 'hono';
import { UseCaseUploadFile } from '../Application/UseCaseUploadFile';
import { UseCaseDownloadFile } from '../Application/UseCaseDownloadFile';
import { UseCaseGetSizeFile } from '../Application/UseCaseGetSizeFile';
import { EntityUpload } from '../Domain/EntityUpload';
import { EntityDownload } from '../Domain/EntityDownload';
import { EntityFileUpload } from '../Domain/EntityFileUpload';
import { RepositoryMainImpl } from './RepositoryMainImpl';

export class Controller {
  private repo: RepositoryMainImpl;

  constructor() {
    this.repo = new RepositoryMainImpl();
  }

  public async uploadFile(c: Context, body: EntityUpload, file: EntityFileUpload): Promise<boolean> {
    return await new UseCaseUploadFile(this.repo).exec(c, body, file);
  }

  public async downloadFile(c: Context, body: EntityDownload): Promise<R2ObjectBody> {
    return await new UseCaseDownloadFile(this.repo).exec(c, body);
  }

  public async getSizeFile(c: Context, body: EntityDownload): Promise<number> {
    return await new UseCaseGetSizeFile(this.repo).exec(c, body);
  }
}
