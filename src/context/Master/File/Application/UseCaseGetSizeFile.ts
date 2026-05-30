import { Context } from 'hono';
import { EntityDownload } from '../Domain/EntityDownload';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseGetSizeFile {
  constructor(private repository: RepositoryMain) {}

  public async exec(c: Context, body: EntityDownload): Promise<number> {
    await this.repository.validateDownload(body);
    return await this.repository.getSizeR2(c, body);
  }
}
