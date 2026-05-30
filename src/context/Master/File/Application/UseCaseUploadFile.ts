import { Context } from 'hono';
import { EntityUpload } from '../Domain/EntityUpload';
import { EntityFileUpload } from '../Domain/EntityFileUpload';
import { RepositoryMain } from '../Domain/RepositoryMain';

export class UseCaseUploadFile {
  constructor(private repository: RepositoryMain) {}

  public async exec(c: Context, body: EntityUpload, file: EntityFileUpload): Promise<boolean> {
    await this.repository.validateUpload(body);
    return await this.repository.uploadFileR2(c, body, file);
  }
}
