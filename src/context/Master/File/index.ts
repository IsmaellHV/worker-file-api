import { Router } from './Infraestructure/Router';

export class ManagerEntity {
  public router: Router;

  constructor() {
    this.router = new Router();
  }

  public async exec() {
    await this.router.exec();
  }
}
