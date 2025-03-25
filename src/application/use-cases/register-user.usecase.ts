import { User } from 'src/domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository.token';
import { ConflictException } from '@nestjs/common';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashFunction: (password: string) => Promise<string>,
    private readonly sendWelcomeEmail?: (
      email: string,
      firstName?: string,
    ) => Promise<void>,
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

    const savedUser = await this.userRepository.save(user);

    // Enviar correo de bienvenida si la función está disponible
    if (this.sendWelcomeEmail) {
      try {
        await this.sendWelcomeEmail(email, firstName);
      } catch (error) {
        // Log the error but don't fail the registration
        console.error('Error sending welcome email:', error);
      }
    }

    return savedUser;
  }
}
