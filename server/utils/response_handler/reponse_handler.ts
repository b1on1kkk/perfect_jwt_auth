import { Response } from 'express';

const accessCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 1000, // 1 minute
};

const refreshCookieOptions = {
  httpOnly: true,
  maxAge: 86400000 * 1000, // 1 day
};

export class ReponseHandler {
  private response: {
    message: string;
    status: number;
    device_id: string | null;
    tokens: { access: string; refresh: string } | null;
  } | null = null;

  constructor(
    private readonly data: {
      message: string;
      status: number;
      device_id: string | null;
      tokens: { access: string; refresh: string } | null;
    } | null,
  ) {
    this.response = data;
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
      .cookie('refresh', this.response.tokens.refresh, refreshCookieOptions)
      .json({ message: this.response.message, status: this.response.status });
  }
}
