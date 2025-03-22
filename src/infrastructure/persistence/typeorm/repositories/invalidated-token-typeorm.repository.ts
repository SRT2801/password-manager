import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { InvalidatedToken } from 'src/domain/entities/invalidated-token.entity';
import { InvalidatedTokenRepository } from 'src/domain/repositories/invalidated-token.repository';
import { InvalidatedTokenTypeORM } from '../entities/invalidated-token.typeorm.entity';

@Injectable()
export class InvalidatedTokenTypeOrmRepository
  implements InvalidatedTokenRepository
{
  constructor(
    @InjectRepository(InvalidatedTokenTypeORM)
    private readonly invalidatedTokenRepository: Repository<InvalidatedTokenTypeORM>,
  ) {}

  async save(invalidatedToken: InvalidatedToken): Promise<void> {
    const invalidatedTokenTypeORM = new InvalidatedTokenTypeORM();
    invalidatedTokenTypeORM.token = invalidatedToken.token;
    invalidatedTokenTypeORM.expiresAt = invalidatedToken.expiresAt;

    await this.invalidatedTokenRepository.save(invalidatedTokenTypeORM);
  }

  async exists(token: string): Promise<boolean> {
    const count = await this.invalidatedTokenRepository.count({
      where: { token },
    });
    return count > 0;
  }

  async cleanExpired(): Promise<void> {
    await this.invalidatedTokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
