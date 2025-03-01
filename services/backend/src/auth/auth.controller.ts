import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      example: JSON.stringify({ username: 'marc', password: 'marc' }),
    },
  })
  async login(
    @Body() loginDto: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sessionId } = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    response.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  @Post('me')
  async me(@Req() req: Request) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      return this.authService.checkAuth(sessionId);
    }
    throw new UnauthorizedException('Not Authorized.');
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      this.authService.logout(sessionId);
      res.clearCookie('sessionId');
    }
    return { message: 'Logut successful' };
  }

  @Post('register')
  @ApiBody({
    schema: {
      example: JSON.stringify({ username: 'marc', password: 'marc' }),
    },
  })
  @HttpCode(201)
  async register(
    @Body() registerDto: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    this.logger.debug(`Request to register ${registerDto.username}`);
    const { sessionId, user } = await this.authService.register(
      registerDto.username,
      registerDto.password,
    );
    this.logger.debug(`Registered ${JSON.stringify(user)}`);

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.debug(`Set cookie with sessionId`);

    return { id: user.id, username: user.username };
  }
}
