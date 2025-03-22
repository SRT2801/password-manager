import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/application/application.module';
import { PasswordController } from './password.controller';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { INVALIDATED_TOKEN_REPOSITORY } from 'src/domain/repositories/invalidated-token.repository';

@Module({
  imports: [ApplicationModule],
  controllers: [PasswordController, AuthController],
  providers: [
    {
      provide: JwtAuthGuard,
      useFactory: (invalidatedTokenRepo) => {
        return new JwtAuthGuard(invalidatedTokenRepo);
      },
      inject: [INVALIDATED_TOKEN_REPOSITORY],
    },
  ],
  exports: [JwtAuthGuard],
})
export class ControllersModule {}
