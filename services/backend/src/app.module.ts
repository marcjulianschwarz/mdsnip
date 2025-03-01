import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SnippetsController } from './snippets/snippets.controller';
import { SnippetsService } from './snippets/snippets.service';
import { DBService } from './db.service';
import { AuthController } from './auth/auth.controller';
import { SessionService } from './auth/session.service';
import { AuthService } from './auth/auth.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserService } from './user/user.service';
import { PreferencesService } from './preferences/preferences.service';
import { PreferencesController } from './preferences/preferences.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    SnippetsController,
    AuthController,
    PreferencesController,
  ],
  providers: [
    AppService,
    SnippetsService,
    DBService,
    SessionService,
    AuthService,
    UserService,
    PreferencesService,
  ],
})
export class AppModule {}
