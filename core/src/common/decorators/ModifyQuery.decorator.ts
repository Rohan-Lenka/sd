import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const ModifyQuery = createParamDecorator(
  (
    fn:
      | undefined
      | ((request: Request) => Request)
      | ((request: Request) => Request)[],
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (Array.isArray(fn)) {
      fn.forEach((f) => f?.(request));
    } else {
      fn?.(request);
    }
    return request.query;
  },
);