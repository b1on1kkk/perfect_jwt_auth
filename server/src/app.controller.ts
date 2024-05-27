import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
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

  @Post('/check')
  async Check(@Req() req: Request, @Res() res: Response) {
    console.log(req.cookies);

    if (req.cookies.access) {
      const { message, status, request_to_refresh } =
        await this.appService.Check(req.cookies.access);

      return res.status(status).json({ message, status, request_to_refresh });
    }

    return res.status(404).json({
      message: 'Access token is not exist',
      status: 404,
      request_to_refresh: false,
    });
  }
}
