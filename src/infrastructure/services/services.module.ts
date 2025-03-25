import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { EncryptionService } from './encryption/encryption.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [BcryptService, EncryptionService],
  exports: [BcryptService, EncryptionService, MailModule],
})
export class ServicesModule {}
