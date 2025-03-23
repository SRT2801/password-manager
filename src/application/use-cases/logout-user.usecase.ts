import { InvalidatedToken } from 'src/domain/entities/invalidated-token.entity';
import { InvalidatedTokenRepository } from 'src/domain/repositories/invalidated-token.repository';
import * as jwt from 'jsonwebtoken';

export class LogoutUserUseCase {
  constructor(
    private readonly invalidatedTokenRepository: InvalidatedTokenRepository,
  ) {}

  async execute(token: string): Promise<void> {
    const decoded = jwt.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token format');
    }

    const expiresAt = new Date(decoded.exp * 1000);

    const invalidatedToken = new InvalidatedToken(token, expiresAt);
    await this.invalidatedTokenRepository.save(invalidatedToken);
  }
}
