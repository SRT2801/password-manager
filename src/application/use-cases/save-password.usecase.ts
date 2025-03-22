import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';

export class SavePasswordUseCase {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly hashFunction: (password: string) => Promise<string>,
  ) {}

  async execute(
    userId: number,
    serviceName: string,
    userName: string,
    plainPassword: string,
  ): Promise<Password> {
    const encryptedPassword = await this.hashFunction(plainPassword);

    const password = new Password(
      serviceName,
      userName,
      encryptedPassword,
      userId,
    );

    await this.passwordRepository.save(password);

    return password;
  }
}
