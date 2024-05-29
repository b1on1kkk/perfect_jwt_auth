import { Response } from 'express';

import type { responseToUser } from 'types/responseToUser';

const accessCookieOptions = {
  httpOnly: true,
};

const refreshCookieOptions = {
  httpOnly: true,
};

export class ReponseHandler {
  private response: responseToUser = null;

  constructor(private readonly data: responseToUser) {
    this.response = data;
  }

  public rememberMeResponse(res: Response) {
    if (this.response.status !== 200) {
      return res
        .status(this.response.status)
        .json({ message: this.response.message, status: this.response.status });
    }

    return res
      .status(this.response.status)
      .cookie('access', this.response.tokens.access, accessCookieOptions)
      .cookie('refresh', this.response.tokens.refresh, refreshCookieOptions)
      .json({
        message: this.response.message,
        status: this.response.status,
        device_id: this.response.device_id,
      });
  }

  public basicReponse(res: Response) {
    if (this.response.status !== 200) {
      return res
        .status(this.response.status)
        .json({ message: this.response.message, status: this.response.status });
    }

    return res
      .status(this.response.status)
      .cookie('access', this.response.tokens.access, accessCookieOptions)
      .json({
        message: this.response.message,
        status: this.response.status,
        device_id: this.response.device_id,
      });
  }
}
