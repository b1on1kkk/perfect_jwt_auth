import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokensService {
  constructor(private jwtService: JwtService) {}

  public tokensGenerator(device_id: string) {
    const access_token = this.jwtService.sign(
      { device_id },
      { secret: process.env.JWT_SECRET_ACCESS_KEY, expiresIn: '1m' },
    );

    const refresh_token = this.jwtService.sign(
      { device_id },
      { secret: process.env.JWT_SECRET_REFRESH_KEY, expiresIn: '1d' },
    );

    const refresh_token_issued: { name: string; iat: number; exp: number } =
      this.jwtService.decode(refresh_token);

    return { access_token, refresh_token, issuedAt: refresh_token_issued };
  }
}
