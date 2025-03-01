import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';
import { compare, hash } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.getUser(username);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const sessionId = await this.sessionService.createSession(user.id, {
      id: user.id,
      username: user.username,
    });

    return { sessionId };
  }

  async checkAuth(sessionId: string) {
    const session = await this.sessionService.getSession(sessionId);
    if (session) {
      const user = await this.userService.getUserById(session.user_id);
      return user;
    }
    throw new UnauthorizedException('Not Authorized.');
  }

  logout(sessionId: string) {
    this.sessionService.deleteSession(sessionId);
  }

  async register(username: string, password: string) {
    this.logger.debug(`Registering ${username}`);

    const hashedPassword = await hash(password, 12);
    const user = await this.userService.createUser(username, hashedPassword);

    this.logger.debug(`Registered ${JSON.stringify(user)}`);
    this.logger.debug('Creating new user session.');

    const sessionId = await this.sessionService.createSession(user.id, {
      id: user.id,
      username: user.username,
    });

    this.logger.debug(`Created user session with ${sessionId}`);

    return { sessionId, user: { id: user.id, username: user.username } };
  }
}
