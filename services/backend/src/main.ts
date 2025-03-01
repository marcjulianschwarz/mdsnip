import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

async function bootstrap() {
  let httpsOptions: HttpsOptions | undefined = undefined;
  if (fs.existsSync('./cert')) {
    httpsOptions = {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const config = new DocumentBuilder()
    .setTitle('mdsnip')
    .setDescription('Share markdown snippet')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(configService.get('BACKEND_PORT') || 3000);
}
bootstrap();
