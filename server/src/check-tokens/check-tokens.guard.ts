import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class CheckTokensGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const cookies = context.switchToHttp().getRequest<Request>().cookies;
    const refresh = cookies['refresh'];
    const access = cookies['access'];

    if (access && refresh) return false;

    return true;
  }
}
