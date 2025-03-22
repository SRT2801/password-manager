import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository.token';
import { UserTypeORM } from '../entities/user.typeorm.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeORM)
    private readonly userRepository: Repository<UserTypeORM>,
  ) {}

  async save(user: User): Promise<User> {
    const userTypeORM = new UserTypeORM();
    userTypeORM.email = user.email;
    userTypeORM.passwordHash = user.passwordHash;
    userTypeORM.firstName = user.firstName;
    userTypeORM.lastName = user.lastName;

    const savedUser = await this.userRepository.save(userTypeORM);

    return {
      id: savedUser.id,
      email: savedUser.email,
      passwordHash: savedUser.passwordHash,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const userTypeORM = await this.userRepository.findOne({
      where: { email },
    });

    if (!userTypeORM) return null;

    return {
      id: userTypeORM.id,
      email: userTypeORM.email,
      passwordHash: userTypeORM.passwordHash,
      firstName: userTypeORM.firstName,
      lastName: userTypeORM.lastName,
    };
  }

  async findById(id: number): Promise<User | null> {
    const userTypeORM = await this.userRepository.findOne({
      where: { id },
    });

    if (!userTypeORM) return null;

    return {
      id: userTypeORM.id,
      email: userTypeORM.email,
      passwordHash: userTypeORM.passwordHash,
      firstName: userTypeORM.firstName,
      lastName: userTypeORM.lastName,
    };
  }
}
