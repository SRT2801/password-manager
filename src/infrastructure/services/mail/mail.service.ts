import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

export interface MailData {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class MailService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    const mailData: MailData = {
      to: email,
      subject: '¡Bienvenido/a a Password Manager!',
      template: 'welcome',
      context: {
        name: firstName || 'Usuario',
        appName: 'Password Manager',
        supportEmail: this.configService.get<string>(
          'SUPPORT_EMAIL',
          'support@passwordmanager.com',
        ),
      },
    };

    await this.redisService.addToQueue('welcome-email', mailData);
  }
}
