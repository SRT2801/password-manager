import { Module } from '@nestjs/common';
import { SavePasswordUseCase } from './use-cases/save-password.usecase';
import { GetPasswordUseCase } from './use-cases/get-password.usecase';
import { GetAllPasswordsUseCase } from './use-cases/get-all-passwords.usecase';
import { RegisterUserUseCase } from './use-cases/register-user.usecase';
import { LoginUserUseCase } from './use-cases/login-user.usecase';
import { LogoutUserUseCase } from './use-cases/logout-user.usecase';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { ServicesModule } from 'src/infrastructure/services/services.module';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { PASSWORD_REPOSITORY } from 'src/domain/repositories/password.repository.token';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository.token';
import { INVALIDATED_TOKEN_REPOSITORY } from 'src/domain/repositories/invalidated-token.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PersistenceModule, ServicesModule],
  providers: [
    {
      provide: SavePasswordUseCase,
      useFactory: (repo, bcrypt: BcryptService) => {
        return new SavePasswordUseCase(repo, bcrypt.hash.bind(bcrypt));
      },
      inject: [PASSWORD_REPOSITORY, BcryptService],
    },
    {
      provide: GetPasswordUseCase,
      useFactory: (repo) => {
        return new GetPasswordUseCase(repo);
      },
      inject: [PASSWORD_REPOSITORY],
    },
    {
      provide: GetAllPasswordsUseCase,
      useFactory: (repo) => {
        return new GetAllPasswordsUseCase(repo);
      },
      inject: [PASSWORD_REPOSITORY],
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo, bcrypt: BcryptService) => {
        return new RegisterUserUseCase(repo, bcrypt.hash.bind(bcrypt));
      },
      inject: [USER_REPOSITORY, BcryptService],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        repo,
        bcrypt: BcryptService,
        configService: ConfigService,
      ) => {
        return new LoginUserUseCase(
          repo,
          bcrypt.compare.bind(bcrypt),
          configService.get('JWT_SECRET') || 'your-secret-key',
        );
      },
      inject: [USER_REPOSITORY, BcryptService, ConfigService],
    },
    {
      provide: LogoutUserUseCase,
      useFactory: (repo) => {
        return new LogoutUserUseCase(repo);
      },
      inject: [INVALIDATED_TOKEN_REPOSITORY],
    },
  ],
  exports: [
    SavePasswordUseCase,
    GetPasswordUseCase,
    GetAllPasswordsUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    LogoutUserUseCase,
    PersistenceModule,
  ],
})
export class ApplicationModule {}
