import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokensService {
  constructor(private jwtService: JwtService) {}

  public tokensGenerator(user_id: number) {
    const access_token = this.jwtService.sign(
      { user_id },
      { secret: process.env.JWT_SECRET_ACCESS_KEY, expiresIn: '30s' },
    );

    const refresh_token = this.jwtService.sign(
      { user_id },
      { secret: process.env.JWT_SECRET_REFRESH_KEY, expiresIn: '1h' },
    );

    const refresh_token_issued: { name: string; iat: number; exp: number } =
      this.jwtService.decode(refresh_token);

    return { access_token, refresh_token, issuedAt: refresh_token_issued };
  }
}
