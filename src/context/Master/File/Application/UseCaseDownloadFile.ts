import { Context } from 'hono';
import { EntityDownload } from '../Domain/EntityDownload';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseDownloadFile {
  constructor(private repository: RepositoryMain) {}

  public async exec(c: Context, body: EntityDownload): Promise<R2ObjectBody> {
    await this.repository.validateDownload(body);
    return await this.repository.downloadFileR2(c, body);
  }
}
