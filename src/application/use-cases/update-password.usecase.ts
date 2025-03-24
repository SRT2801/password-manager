import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';
import { NotFoundException } from '@nestjs/common';

export class UpdatePasswordUseCase {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly encryptFunction: (password: string) => string,
  ) {}

  async execute(
    id: number,
    userId: number,
    serviceName?: string,
    userName?: string,
    plainPassword?: string,
  ): Promise<Password> {
    const existingPassword = await this.passwordRepository.findById(id, userId);

    if (!existingPassword) {
      throw new NotFoundException('Password not found');
    }

    if (serviceName) existingPassword.serviceName = serviceName;
    if (userName) existingPassword.userName = userName;

    if (plainPassword) {
      existingPassword.encryptedPassword = this.encryptFunction(plainPassword);
    }

    existingPassword.updatedAt = new Date();

    await this.passwordRepository.update(existingPassword);

    return existingPassword;
  }
}
