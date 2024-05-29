import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    }),
  );

  await app.listen(4000);
}
bootstrap();
