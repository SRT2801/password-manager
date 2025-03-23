import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';

export class GetPasswordUseCase {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly decryptFunction: (encryptedPassword: string) => string,
  ) {}

  async execute(serviceName: string, userId: number): Promise<Password | null> {
    const password = await this.passwordRepository.findByService(
      serviceName,
      userId,
    );

    if (!password) return null;


    password.decryptedPassword = this.decryptFunction(
      password.encryptedPassword,
    );

    return password;
  }
}
