import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Request, Response } from 'express';
import { ReponseHandler } from 'utils/response_handler/reponse_handler';
import { SignInDTO } from 'types/SignInDTO';
import { loginInDTO } from 'types/loginInDTO';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/signin')
  async SignIn(
    @Body() data: SignInDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (
      Object.keys(req.cookies).includes('access') ||
      Object.keys(req.cookies).includes('refresh')
    ) {
      return res
        .status(500)
        .json({ message: "You've already logged in!", status: 500 });
    }

    const response_handler = new ReponseHandler(
      await this.appService.SignIn(data, req),
    );

    response_handler.basicReponse(res);
  }

  @Post('/login')
  async Login(
    @Body() data: loginInDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(req.cookies);

    if (
      Object.keys(req.cookies).includes('access') ||
      Object.keys(req.cookies).includes('refresh')
    ) {
      return res
        .status(500)
        .json({ message: "You've already logged in!", status: 500 });
    }

    const response_handler = new ReponseHandler(
      await this.appService.Login(data, req),
    );

    response_handler.basicReponse(res);
  }

  @Post('/refresh')
  async Refresh(
    @Body() data: { refresh_token: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { message, status, tokens } = await this.appService.Refresh(
      data.refresh_token,
      req,
    );

    return res.status(status).json({ message, status, tokens });
  }
}
