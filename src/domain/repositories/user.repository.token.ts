import { User } from '../entities/user.entity';

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
