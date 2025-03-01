import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies['sessionId'];

    if (!sessionId) {
      throw new UnauthorizedException('No session found');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Invalid session.');
    }

    request.user = session.data;
    return true;
  }
}
