import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DBService } from './db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: DBService,
  ) {}

  @Get()
  getAPIRunning(): string {
    return this.appService.getAPIRunning();
  }

  @Get('resetDB')
  resetDB() {
    return this.dbService.resetDatabase();
  }
}
