import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { PasswordTypeORM } from './infrastructure/persistence/typeorm/entities/password.typeorm.entity';
import { UserTypeORM } from './infrastructure/persistence/typeorm/entities/user.typeorm.entity';
import { InvalidatedTokenTypeORM } from './infrastructure/persistence/typeorm/entities/invalidated-token.typeorm.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'password_manager',
      entities: [PasswordTypeORM, UserTypeORM, InvalidatedTokenTypeORM],
      synchronize: true,
    }),
    ControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
