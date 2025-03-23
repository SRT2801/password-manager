import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.usecase';
import { LoginUserUseCase } from 'src/application/use-cases/login-user.usecase';
import { LogoutUserUseCase } from 'src/application/use-cases/logout-user.usecase';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ValidationMessages } from '../shared/constants/validation-messages.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const { email, password, firstName, lastName } = registerUserDto;
    const user = await this.registerUserUseCase.execute(
      email,
      password,
      firstName,
      lastName,
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      message: ValidationMessages.USER_REGISTERED,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    return this.loginUserUseCase.execute(email, password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    const token = this.extractTokenFromHeader(req);
    if (token) {
      await this.logoutUserUseCase.execute(token);
    }
    return { message: ValidationMessages.SESSION_CLOSED };
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
