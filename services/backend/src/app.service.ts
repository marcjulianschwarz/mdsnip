import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAPIRunning(): string {
    return 'API is running!';
  }
}
