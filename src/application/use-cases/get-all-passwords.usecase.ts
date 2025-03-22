import { Password } from 'src/domain/entities/password.entity';
import { PasswordRepository } from 'src/domain/repositories/password.repository.token';

export class GetAllPasswordsUseCase {
  constructor(private readonly passwordRepository: PasswordRepository) {}

  async execute(userId: number): Promise<Password[]> {
    return this.passwordRepository.findAllByUserId(userId);
  }
}
