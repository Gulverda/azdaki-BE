import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { AdminRequest } from './admin.guard';

/** handler-ში: me(@CurrentAdmin() admin: JwtPayload) — AdminGuard-ის მიერ დასმული მონაცემი */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AdminRequest>().admin,
);
