import { Hono } from 'hono';
import { IManager } from './IManager';

export class RouterRest {
  public router: Hono;
  private managers: IManager[] = [];

  constructor() {
    this.router = new Hono();
  }

  public async exec() {
    await this.initializeEntitys();
    await this.handleRoutes();
  }

  private async initializeEntitys() {
    await this.getRoutes();
    for await (const row of this.managers) {
      await row.manager.exec();
    }
  }

  private async getRoutes() {
    const { ManagerEntity } = await import('../context/Master/File');
    this.managers.push({ manager: new ManagerEntity(), schema: 'MASTER', entity: 'FILE' });
  }

  private async handleRoutes() {
    for (const row of this.managers) {
      const manager = row.manager;
      try {
        if (manager.controller) {
          this.router.route('/', manager.controller.router);
        } else {
          this.router.route('/', manager.router.router);
        }
      } catch (error) {}
    }
  }
}
