import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository.token';
import { ConflictException } from '@nestjs/common';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashFunction: (password: string) => Promise<string>,
  ) {}

  async execute(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.hashFunction(password);
    const user = new User(email, passwordHash, firstName, lastName);

    return this.userRepository.save(user);
  }
}
