import { createParamDecorator, ExecutionContext } from "@nestjs/common";
/**
 * Must be used alongside AuthGuard otherwise returns undefined.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
