import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const ActiveUserId = createParamDecorator<undefined, ExecutionContext>(
  (data, context) => {
    const req = context.switchToHttp().getRequest();
    const userId = req.userId;

    if (!userId) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return userId;
  },
);
