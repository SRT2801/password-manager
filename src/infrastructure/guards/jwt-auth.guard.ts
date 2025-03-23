import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import {
  InvalidatedTokenRepository,
  INVALIDATED_TOKEN_REPOSITORY,
} from 'src/domain/repositories/invalidated-token.repository';
import { ValidationMessages } from '../shared/constants/validation-messages.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor(
    @Inject(INVALIDATED_TOKEN_REPOSITORY)
    private readonly invalidatedTokenRepository: InvalidatedTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const isInvalidated = await this.invalidatedTokenRepository.exists(token);
    if (isInvalidated) {
      throw new UnauthorizedException(ValidationMessages.SESSION_EXPIRED);
    }

    try {
      const payload = jwt.verify(token, this.JWT_SECRET);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
