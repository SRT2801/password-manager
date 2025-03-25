import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [MailService, MailProcessor, RedisService],
  exports: [MailService],
})
export class MailModule {}
