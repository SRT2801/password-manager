import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTypeORM } from './user.typeorm.entity';

@Entity('passwords')
export class PasswordTypeORM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ name: 'encrypted_password' })
  encryptedPassword: string;

  @ManyToOne(() => UserTypeORM, (user) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user: UserTypeORM;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // En su lugar, TypeORM generará un userId virtualmente disponible
  userId: number;
}
