import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { Request, Response } from 'express';

import type { SignInDTO } from 'types/SignInDTO';
import type { loginInDTO } from 'types/loginInDTO';

import { ReponseHandler } from 'utils/response_handler/reponse_handler';
import { CheckTokensGuard } from './check-tokens/check-tokens.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signin')
  @UseGuards(CheckTokensGuard)
  async SignIn(
    @Body() data: SignInDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response_handler = new ReponseHandler(
      await this.appService.SignIn(data, req),
    );

    response_handler.basicReponse(res);
  }

  @Post('/login')
  @UseGuards(CheckTokensGuard)
  async Login(
    @Body() data: loginInDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response_handler = new ReponseHandler(
      await this.appService.Login(data, req),
    );

    response_handler.basicReponse(res);
  }

  @Post('/refresh')
  async Refresh(
    @Body() data: { issuedAt: number; refresh_token: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { message, status } = await this.appService.Refresh(
      data.refresh_token,
      data.issuedAt,
      req,
    );

    return res.status(status).json({ message, status });
  }
}
