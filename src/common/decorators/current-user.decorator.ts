import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export interface CurrentUserPayload {
  id: number;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof CurrentUserPayload | undefined,
    ctx: ExecutionContext,
  ): CurrentUserPayload | CurrentUserPayload[keyof CurrentUserPayload] | undefined => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: CurrentUserPayload }>();
    const user = request.user;
    if (!user) {
      return undefined;
    }
    return data ? user[data] : user;
  },
);
