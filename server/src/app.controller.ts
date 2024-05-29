import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { Request, Response } from 'express';

import type { SignInDTO } from 'types/SignInDTO';
import type { RefreshDTO } from 'types/RefreshDTO';
import type { LoginInDTO } from 'types/LoginInDTO';

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

    if (data.status) return response_handler.rememberMeResponse(res);

    return response_handler.basicReponse(res);
  }

  @Post('/login')
  @UseGuards(CheckTokensGuard)
  async Login(
    @Body() data: LoginInDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response_handler = new ReponseHandler(
      await this.appService.Login(data, req),
    );

    if (data.status) return response_handler.rememberMeResponse(res);

    return response_handler.basicReponse(res);
  }

  @Post('/refresh')
  async Refresh(
    @Body() data: RefreshDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // get old token
    const old_refresh_token = req.headers.authorization.split(':')[1];

    const { message, status } = await this.appService.Refresh(
      old_refresh_token,
      data.issuedAt,
      data.device,
      req,
    );

    return res.status(status).json({ message, status });
  }

  // just remove cookies and delete data from db
  // @Post('/logout')
  // ... and more ...
}
