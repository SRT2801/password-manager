import { UserRepository } from 'src/domain/repositories/user.repository.token';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly compareFunction: (
      plainText: string,
      hash: string,
    ) => Promise<boolean>,
    private readonly jwtSecret: string,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.compareFunction(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '1h' },
    );

    return {
      token,
      userId: user.id,
      email: user.email,
    };
  }
}
