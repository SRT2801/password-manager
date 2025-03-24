import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavePasswordUseCase } from 'src/application/use-cases/save-password.usecase';
import { GetPasswordUseCase } from 'src/application/use-cases/get-password.usecase';
import { GetAllPasswordsUseCase } from 'src/application/use-cases/get-all-passwords.usecase';
import { UpdatePasswordUseCase } from 'src/application/use-cases/update-password.usecase';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SavePasswordDto } from './dtos/save-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ValidationMessages } from '../shared/constants/validation-messages.constants';

@Controller('passwords')
@UseGuards(JwtAuthGuard)
export class PasswordController {
  constructor(
    private readonly savePasswordUseCase: SavePasswordUseCase,
    private readonly getPasswordUseCase: GetPasswordUseCase,
    private readonly getAllPasswordsUseCase: GetAllPasswordsUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
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
      message: ValidationMessages.PASSWORD_SAVED,
    };
  }

  @Get(':serviceName')
  async getPassword(@Param('serviceName') serviceName: string, @Request() req) {
    const { userId } = req.user;
    const password = await this.getPasswordUseCase.execute(serviceName, userId);

    if (!password) {
      return { message: ValidationMessages.PASSWORD_NOT_FOUND };
    }

    return {
      id: password.id,
      serviceName: password.serviceName,
      userName: password.userName,
      password: password.decryptedPassword,
      createdAt: password.createdAt,
      updatedAt: password.updatedAt,
    };
  }

  @Get()
  async getAllPasswords(@Request() req) {
    const { userId } = req.user;
    const passwords = await this.getAllPasswordsUseCase.execute(userId);

    return passwords.map((password) => ({
      id: password.id,
      serviceName: password.serviceName,
      userName: password.userName,
      password: password.decryptedPassword,
      createdAt: password.createdAt,
      updatedAt: password.updatedAt,
    }));
  }

  @Patch(':id')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePasswordDto,
    @Request() req,
  ) {
    const { serviceName, userName, password } = body;
    const { userId } = req.user;

    const updatedPassword = await this.updatePasswordUseCase.execute(
      id,
      userId,
      serviceName,
      userName,
      password,
    );

    return {
      id: updatedPassword.id,
      serviceName: updatedPassword.serviceName,
      userName: updatedPassword.userName,
      message: ValidationMessages.PASSWORD_UPDATED,
    };
  }
}
