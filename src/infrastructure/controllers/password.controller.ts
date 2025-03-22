import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavePasswordUseCase } from 'src/application/use-cases/save-password.usecase';
import { GetPasswordUseCase } from 'src/application/use-cases/get-password.usecase';
import { GetAllPasswordsUseCase } from 'src/application/use-cases/get-all-passwords.usecase';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SavePasswordDto } from './dtos/save-password.dto';

@Controller('passwords')
@UseGuards(JwtAuthGuard)
export class PasswordController {
  constructor(
    private readonly savePasswordUseCase: SavePasswordUseCase,
    private readonly getPasswordUseCase: GetPasswordUseCase,
    private readonly getAllPasswordsUseCase: GetAllPasswordsUseCase,
  ) {}

  @Post()
  async savePassword(@Body() body: SavePasswordDto, @Request() req) {
    const { serviceName, userName, password } = body;
    const { userId } = req.user;

    const savedPassword = await this.savePasswordUseCase.execute(
      userId,
      serviceName,
      userName,
      password,
    );

    return {
      serviceName: savedPassword.serviceName,
      userName: savedPassword.userName,
      message: 'Password saved successfully',
    };
  }

  @Get(':serviceName')
  async getPassword(@Param('serviceName') serviceName: string, @Request() req) {
    const { userId } = req.user;
    const password = await this.getPasswordUseCase.execute(serviceName, userId);

    if (!password) {
      return { message: 'Password not found' };
    }

    return {
      serviceName: password.serviceName,
      userName: password.userName,
    };
  }

  @Get()
  async getAllPasswords(@Request() req) {
    const { userId } = req.user;
    const passwords = await this.getAllPasswordsUseCase.execute(userId);

    return passwords.map((password) => ({
      serviceName: password.serviceName,
      userName: password.userName,
    }));
  }
}
