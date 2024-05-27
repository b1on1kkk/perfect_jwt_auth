import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensService } from 'utils/generate_tokens/generate_tokens.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, GenerateTokensService],
})
export class AppModule {}
