import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensService } from './generate_tokens.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  providers: [GenerateTokensService],
})
export class GenerateTokensModule {}
