import { Password } from '../entities/password.entity';

export interface PasswordRepository {
  save(password: Password): Promise<void>;
  update(password: Password): Promise<void>;
  findById(id: number, userId: number): Promise<Password | null>;
  findByService(serviceName: string, userId: number): Promise<Password | null>;
  findAllByUserId(userId: number): Promise<Password[]>;
}

export const PASSWORD_REPOSITORY = Symbol('PASSWORD_REPOSITORY');
