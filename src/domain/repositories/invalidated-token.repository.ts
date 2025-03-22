import { InvalidatedToken } from '../entities/invalidated-token.entity';

export interface InvalidatedTokenRepository {
  save(invalidatedToken: InvalidatedToken): Promise<void>;
  exists(token: string): Promise<boolean>;
  cleanExpired(): Promise<void>;
}

export const INVALIDATED_TOKEN_REPOSITORY = Symbol(
  'INVALIDATED_TOKEN_REPOSITORY',
);
