import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';
import { PasswordTypeORM } from '../entities/password.typeorm.entity';
import { UserTypeORM } from '../entities/user.typeorm.entity';

@Injectable()
export class PasswordTypeOrmRepository implements PasswordRepository {
  constructor(
    @InjectRepository(PasswordTypeORM)
    private readonly passwordRepository: Repository<PasswordTypeORM>,
    @InjectRepository(UserTypeORM)
    private readonly userRepository: Repository<UserTypeORM>,
  ) {}

  async save(password: Password): Promise<void> {
    const passwordTypeORM = new PasswordTypeORM();
    passwordTypeORM.serviceName = password.serviceName;
    passwordTypeORM.userName = password.userName;
    passwordTypeORM.encryptedPassword = password.encryptedPassword;

    const user = await this.userRepository.findOne({
      where: { id: password.userId },
    });

    if (user) {
      passwordTypeORM.user = user;
    }

    await this.passwordRepository.save(passwordTypeORM);
  }

  async findByService(
    serviceName: string,
    userId: number,
  ): Promise<Password | null> {
    const passwordTypeORM = await this.passwordRepository.findOne({
      where: {
        serviceName: serviceName,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!passwordTypeORM) return null;

    const password = new Password(
      passwordTypeORM.serviceName,
      passwordTypeORM.userName,
      passwordTypeORM.encryptedPassword,
      passwordTypeORM.user.id,
    );


    password.id = passwordTypeORM.id;
    password.createdAt = passwordTypeORM.createdAt;
    password.updatedAt = passwordTypeORM.updatedAt;

    return password;
  }

  async findAllByUserId(userId: number): Promise<Password[]> {
    const passwordsTypeORM = await this.passwordRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return passwordsTypeORM.map((p) => {
      const password = new Password(
        p.serviceName,
        p.userName,
        p.encryptedPassword,
        p.user.id,
      );

      password.id = p.id;
      password.createdAt = p.createdAt;
      password.updatedAt = p.updatedAt;

      return password;
    });
  }

  async findById(id: number, userId: number): Promise<Password | null> {
    const passwordTypeORM = await this.passwordRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!passwordTypeORM) return null;

    const password = new Password(
      passwordTypeORM.serviceName,
      passwordTypeORM.userName,
      passwordTypeORM.encryptedPassword,
      passwordTypeORM.user.id,
    );

    password.id = passwordTypeORM.id;
    password.createdAt = passwordTypeORM.createdAt;
    password.updatedAt = passwordTypeORM.updatedAt;

    return password;
  }

  async update(password: Password): Promise<void> {
    const passwordTypeORM = await this.passwordRepository.findOne({
      where: {
        id: password.id,
        user: { id: password.userId },
      },
      relations: ['user'],
    });

    if (passwordTypeORM) {
      passwordTypeORM.serviceName = password.serviceName;
      passwordTypeORM.userName = password.userName;
      passwordTypeORM.encryptedPassword = password.encryptedPassword;

      await this.passwordRepository.save(passwordTypeORM);
    }
  }
}
