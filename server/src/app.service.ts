import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';

import { Responses } from 'utils/responses/responses';
import { GenerateTokensService } from 'utils/generate_tokens/generate_tokens.service';

import type { Request } from 'express';
import type { SignInDTO } from 'types/SignInDTO';
import type { LoginInDTO } from 'types/LoginInDTO';
import type { registrationResponse } from 'types/registrationResponse';
import { refreshResponse } from 'types/refreshResponse';

@Injectable()
export class AppService {
  private reponses: Responses;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private generateTokens: GenerateTokensService,
  ) {
    this.reponses = new Responses();
  }

  async SignIn(data: SignInDTO, req: Request): registrationResponse {
    try {
      const userExistance = await this.prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!userExistance) {
        const device_id = uuidv4();

        const { id } = await this.prisma.users.create({
          data: {
            name: data.name,
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
          },
          select: {
            id: true,
          },
        });

        const { access_token, refresh_token, issuedAt } =
          this.generateTokens.tokensGenerator(id);

        await this.prisma.refreshtokensmeta.create({
          data: {
            user_id: id,
            issuedAt: issuedAt.iat,
            device_id: device_id,
            ip: req.ip,
            device_name: req.headers['user-agent'],
          },
        });

        return this.reponses.success(device_id, access_token, refresh_token);
      }

      return this.reponses.dataIsUsed();
    } catch (error) {
      return this.reponses.serverError();
    }
  }

  async Login(data: LoginInDTO, req: Request): registrationResponse {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });
      // if user is not found - show error
      if (!user) return this.reponses.notFound();

      const passwordMatch = await bcrypt.compare(data.password, user.password);
      // if password is not match - show error
      if (!passwordMatch) return this.reponses.notFound();

      // generate tokens
      const { access_token, refresh_token, issuedAt } =
        this.generateTokens.tokensGenerator(user.id);

      // if user save device_id in localstorage, just based on this key generate new tokens and update the device in database
      if (data.device_id) {
        await this.prisma.refreshtokensmeta.updateMany({
          where: {
            device_id: data.device_id,
          },
          data: {
            issuedAt: issuedAt.iat,
            ip: req.ip,
            device_name: req.headers['user-agent'],
          },
        });

        return this.reponses.success(
          data.device_id,
          access_token,
          refresh_token,
        );
      }

      // if device_id is not saved in localstorage - generate new and just create new session and new device id
      const device_id: string = uuidv4();

      await this.prisma.refreshtokensmeta.create({
        data: {
          user_id: user.id,
          issuedAt: issuedAt.iat,
          device_id: device_id,
          ip: req.ip,
          device_name: req.headers['user-agent'],
        },
      });

      return this.reponses.success(device_id, access_token, refresh_token);
    } catch (error) {
      return this.reponses.serverError();
    }
  }

  async Refresh(
    token: string,
    issuedAt: number,
    device: string,
    req: Request,
  ): refreshResponse {
    try {
      const decoded_token: { user_id: number; iat: number; exp: number } =
        this.jwt.verify(token, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        });

      const updated = await this.prisma.refreshtokensmeta.updateMany({
        where: {
          user_id: decoded_token.user_id,
          issuedAt: decoded_token.iat,
        },
        data: {
          issuedAt: issuedAt,
          ip: req.ip,
          device_name: device,
        },
      });

      if (updated.count > 0) return this.reponses.refreshAllowed();

      return this.reponses.refreshNotAllowed(404);
    } catch (error) {
      return this.reponses.refreshNotAllowed(401);
    }
  }
}
