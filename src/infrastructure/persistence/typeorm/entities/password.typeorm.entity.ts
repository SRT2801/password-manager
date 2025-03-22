import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  // En su lugar, TypeORM generará un userId virtualmente disponible
  userId: number;
}
