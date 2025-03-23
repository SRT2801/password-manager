import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';

export class GetAllPasswordsUseCase {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly decryptFunction: (encryptedPassword: string) => string,
  ) {}

  async execute(userId: number): Promise<Password[]> {
    const passwords = await this.passwordRepository.findAllByUserId(userId);


    return passwords.map((password) => {
      password.decryptedPassword = this.decryptFunction(
        password.encryptedPassword,
      );
      return password;
    });
  }
}
