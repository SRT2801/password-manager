import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailData } from './mail.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MailProcessor implements OnModuleInit {
  private readonly logger = new Logger(MailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: this.configService.get<boolean>('MAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('MAIL_USER', ''),
        pass: this.configService.get<string>('MAIL_PASSWORD', ''),
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2',
      },
    });
  }

  onModuleInit() {
    this.redisService.on('welcome-email', this.handleWelcomeEmail.bind(this));
  }

  async handleWelcomeEmail(data: MailData): Promise<void> {
    this.logger.log(`Procesando correo de bienvenida para: ${data.to}`);

    try {
      const { to, subject, context } = data;

      const html = this.getWelcomeEmailTemplate(context);

      await this.transporter.sendMail({
        from: `"${this.configService.get<string>('MAIL_FROM_NAME', 'Password Manager')}" <${this.configService.get<string>('MAIL_FROM', 'noreply@passwordmanager.com')}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Correo de bienvenida enviado a: ${to}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar correo de bienvenida: ${error.message}`,
      );
      throw error;
    }
  }

  private getWelcomeEmailTemplate(context: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a ${context.appName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f5f5f5;
            line-height: 1.6;
          }
          
          .container {
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          .brand-top {
            background-color: #1a237e;
            padding: 15px 0;
            text-align: center;
          }
          
          .header {
            background: linear-gradient(120deg, #3949ab 0%, #1a237e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .logo-container {
            margin-bottom: 20px;
            display: inline-block;
            background-color: white;
            border-radius: 50%;
            padding: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          }
          
          .content {
            padding: 40px 30px;
            line-height: 1.7;
          }
          
          .greeting {
            font-size: 22px;
            margin-bottom: 25px;
            font-weight: 600;
            color: #1a237e;
          }
          
          .greeting span {
            color: #3949ab;
            border-bottom: 2px solid #3949ab;
            padding-bottom: 2px;
          }
          
          .message {
            margin-bottom: 30px;
            font-size: 16px;
            color: #424242;
          }
          
          .features {
            background-color: #f4f7fc;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border-top: 4px solid #3949ab;
          }
          
          .features h3 {
            margin-top: 0;
            color: #1a237e;
            font-weight: 600;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
            position: relative;
          }
          
          .features h3::after {
            content: "";
            display: block;
            width: 50px;
            height: 3px;
            background-color: #3949ab;
            margin: 10px auto 0;
          }
          
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .feature-item {
            padding: 14px 0 14px 45px;
            position: relative;
            border-bottom: 1px solid #e1e7f5;
            font-size: 16px;
          }
          
          .feature-item:last-child {
            border-bottom: none;
          }
          
          .feature-item:before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 30px;
            height: 30px;
            background-color: #e8f0fe;
            border-radius: 50%;
          }
          
          .feature-item:after {
            content: "✓";
            position: absolute;
            left: 9px;
            top: 14px;
            color: #3949ab;
            font-weight: bold;
            font-size: 16px;
          }
          
          .feature-item span {
            font-weight: 500;
            color: #1a237e;
          }
          
          .support {
            background-color: #e8f0fe;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            position: relative;
            border-left: 5px solid #3949ab;
          }
          
          .support p {
            margin: 0;
            font-size: 16px;
            color: #424242;
          }
          
          .support a {
            color: #3949ab;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px dashed #3949ab;
            transition: all 0.2s ease;
          }
          
          .support a:hover {
            color: #1a237e;
            border-bottom-style: solid;
          }
          
          .support:before {
            content: "💬";
            font-size: 24px;
            position: absolute;
            right: 20px;
            top: 20px;
          }
          
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          
          .button {
            display: inline-block;
            background-color: #3949ab;
            color: white !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(57, 73, 171, 0.3);
            transition: all 0.3s ease;
            border: none;
            letter-spacing: 0.5px;
          }
          
          .button:hover {
            background-color: #1a237e;
            box-shadow: 0 6px 15px rgba(26, 35, 126, 0.4);
            transform: translateY(-2px);
          }
          
          .closing {
            text-align: center;
            margin-top: 30px;
            font-size: 18px;
            color: #424242;
            font-weight: 500;
          }
          
          .divider {
            height: 1px;
            background-color: #e0e0e0;
            margin: 30px 0;
          }
          
          .footer {
            text-align: center;
            padding: 25px;
            color: #757575;
            font-size: 14px;
            background-color: #f8f9fa;
            border-top: 1px solid #e0e0e0;
          }
          
          .team {
            font-weight: 600;
            color: #424242;
            margin-bottom: 15px;
          }
          
          .social-links {
            margin: 20px 0;
          }
        
          
          .copyright {
            margin-top: 15px;
            font-size: 12px;
            color: #9e9e9e;
          }
          
          .special-offer {
            margin-top: 30px;
            padding: 20px;
            background-color: #fff8e1;
            border-radius: 10px;
            border-left: 5px solid #ffc107;
            font-size: 15px;
            color: #795548;
          }
          
          .special-offer strong {
            color: #ff5722;
          }
          
          @media screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              border-radius: 0 !important;
            }
            
            .content {
              padding: 30px 20px !important;
            }
            
            .header {
              padding: 30px 20px !important;
            }
            
            .header h1 {
              font-size: 26px !important;
            }
            
            .greeting {
              font-size: 18px !important;
            }
            
            .button {
              width: 100% !important;
              padding: 12px 20px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand-top">
            <!-- Pequeña franja de color en la parte superior -->
          </div>
          
          <div class="header">
            <div class="logo-container">
              <span style="font-size: 48px;">🔒</span>
            </div>
            <h1>¡Bienvenido/a a ${context.appName}!</h1>
          </div>
          
          <div class="content">
            <p class="greeting">Hola <span>${context.name}</span>,</p>
            
            <p class="message">Nos complace darte la bienvenida a nuestra aplicación de gestión de contraseñas. Estamos emocionados de que hayas decidido unirte a nuestra comunidad de usuarios que valoran la seguridad digital.</p>
            
            <div class="features">
              <h3>Beneficios de tu cuenta nueva</h3>
              <ul class="feature-list">
                <li class="feature-item"><span>Seguridad garantizada</span> - Almacenamiento de tus contraseñas con encriptación avanzada</li>
                <li class="feature-item"><span>Generador inteligente</span> - Crea contraseñas seguras con un solo clic</li>
                <li class="feature-item"><span>Protección continua</span> - Tu información personal siempre protegida</li>
              </ul>
            </div>
            
            <div class="support">
              <p>¿Tienes alguna pregunta sobre cómo comenzar? No dudes en contactar con nuestro equipo de soporte en <a href="mailto:${context.supportEmail}">${context.supportEmail}</a>. Estamos aquí para ayudarte en cada paso.</p>
            </div>
            
          
            <div class="divider"></div>
            
          </div>
          
          <div class="footer">
            <p class="team">El equipo de ${context.appName}</p>
            
            <p class="copyright">© ${new Date().getFullYear()} Password Manager. Todos los derechos reservados.</p>
            
            <p style="margin-top: 15px; font-size: 11px; color: #9e9e9e;">
              Has recibido este correo porque te has registrado en ${context.appName}.<br>
              Si no has sido tú, por favor ignora este mensaje o contacta con nosotros.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
