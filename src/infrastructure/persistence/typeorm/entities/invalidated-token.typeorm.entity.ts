import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invalidated_tokens')
export class InvalidatedTokenTypeORM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;
}
