import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordTypeORM } from './typeorm/entities/password.typeorm.entity';
import { PasswordTypeOrmRepository } from './typeorm/repositories/password-typeorm.repository';
import { PASSWORD_REPOSITORY } from 'src/domain/repositories/password.repository.token';
import { UserTypeORM } from './typeorm/entities/user.typeorm.entity';
import { UserTypeOrmRepository } from './typeorm/repositories/user-typeorm.repository';
import { USER_REPOSITORY } from 'src/domain/repositories/user.repository.token';
import { InvalidatedTokenTypeORM } from './typeorm/entities/invalidated-token.typeorm.entity';
import { InvalidatedTokenTypeOrmRepository } from './typeorm/repositories/invalidated-token-typeorm.repository';
import { INVALIDATED_TOKEN_REPOSITORY } from 'src/domain/repositories/invalidated-token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PasswordTypeORM,
      UserTypeORM,
      InvalidatedTokenTypeORM,
    ]),
  ],
  providers: [
    {
      provide: PASSWORD_REPOSITORY,
      useClass: PasswordTypeOrmRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: INVALIDATED_TOKEN_REPOSITORY,
      useClass: InvalidatedTokenTypeOrmRepository,
    },
  ],
  exports: [PASSWORD_REPOSITORY, USER_REPOSITORY, INVALIDATED_TOKEN_REPOSITORY],
})
export class PersistenceModule {}
