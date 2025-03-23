import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
  
    const secretKey =
      this.configService.get<string>('ENCRYPTION_KEY') ||
      'una-clave-secreta-muy-segura-de-32b';

 
    this.key = crypto.scryptSync(secretKey, 'salt', 32);
  }

  encrypt(text: string): string {

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string): string {
    try {
      const [ivHex, encryptedHex] = encryptedText.split(':');
      if (!ivHex || !encryptedHex) {
        throw new Error('Formato de texto encriptado inválido');
      }
      
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Error desencriptando:', error);
      return '[Error al desencriptar]';
    }
  }
}
