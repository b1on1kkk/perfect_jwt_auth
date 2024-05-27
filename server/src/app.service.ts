import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

import * as bcrypt from 'bcrypt';

import { Request } from 'express';
import { GenerateTokensService } from 'utils/generate_tokens/generate_tokens.service';
import { Responses } from 'utils/responses/responses';
import { SignInDTO } from 'types/SignInDTO';
import { loginInDTO } from 'types/loginInDTO';
import { JwtService } from '@nestjs/jwt';

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

  async SignIn(
    data: SignInDTO,
    req: Request,
  ): Promise<{
    message: string;
    status: number;
    device_id: string | null;
    tokens: { access: string; refresh: string } | null;
  }> {
    try {
      const userExistance = await this.prisma.users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!userExistance) {
        const device_id = uuidv4();
        const { access_token, refresh_token, issuedAt } =
          this.generateTokens.tokensGenerator(device_id);

        const hash_password = await bcrypt.hash(data.password, 10);

        const { id } = await this.prisma.users.create({
          data: {
            name: data.name,
            email: data.email,
            password: hash_password,
          },
          select: {
            id: true,
          },
        });

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
      console.log(error);
      return this.reponses.serverError();
    }
  }

  async Login(
    data: loginInDTO,
    req: Request,
  ): Promise<{
    message: string;
    status: number;
    device_id: string | null;
    tokens: { access: string; refresh: string } | null;
  }> {
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

      // if user save device_id in localstorage, just based on this key generate new tokens and update the device in database
      if (data.device_id !== null) {
        const { access_token, refresh_token, issuedAt } =
          this.generateTokens.tokensGenerator(data.device_id);

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
      const device_id = uuidv4();
      const { access_token, refresh_token, issuedAt } =
        this.generateTokens.tokensGenerator(device_id);

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
      console.log(error);
      return this.reponses.serverError();
    }
  }

  async Check(query: { access: string }): Promise<{
    message: string;
    status: number;
    request_to_refresh: boolean;
  }> {
    try {
      this.jwt.verify(query.access, {
        secret: process.env.JWT_SECRET_ACCESS_KEY,
      });

      return {
        message: 'Ok',
        status: 200,
        request_to_refresh: false,
      };
    } catch (error) {
      console.log(error);

      return {
        message: 'Your access token is not valid anymore',
        status: 401,
        request_to_refresh: true,
      };
    }
  }
}
