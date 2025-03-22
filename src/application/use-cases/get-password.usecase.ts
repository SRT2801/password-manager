import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';

export class GetPasswordUseCase {
  constructor(private readonly passwordRepository: PasswordRepository) {}

  async execute(serviceName: string, userId: number): Promise<Password | null> {
    return this.passwordRepository.findByService(serviceName, userId);
  }
}
