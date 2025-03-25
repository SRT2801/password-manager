import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private subscriber: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    };

    this.client = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);

    this.subscriber.on('message', this.handleMessage.bind(this));
    await this.subscriber.subscribe('mail-queue');
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
  }

  private listeners: Map<string, Function[]> = new Map();

  private handleMessage(channel: string, message: string) {
    if (channel === 'mail-queue') {
      try {
        const data = JSON.parse(message);
        const listeners = this.listeners.get(data.type) || [];

        for (const listener of listeners) {
          listener(data.payload);
        }
      } catch (error) {
        console.error('Error processing Redis message:', error);
      }
    }
  }

  async addToQueue(type: string, payload: any): Promise<void> {
    await this.client.publish('mail-queue', JSON.stringify({ type, payload }));
  }

  on(eventType: string, callback: Function): void {
    const listeners = this.listeners.get(eventType) || [];
    listeners.push(callback);
    this.listeners.set(eventType, listeners);
  }
}
