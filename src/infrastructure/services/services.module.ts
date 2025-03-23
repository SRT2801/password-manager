import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt/bcrypt.service';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  providers: [BcryptService, EncryptionService],
  exports: [BcryptService, EncryptionService],
})
export class ServicesModule {}
