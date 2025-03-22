import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordTypeORM } from './password.typeorm.entity';

@Entity('users')
export class UserTypeORM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string; 

  @Column({ name: 'last_name', nullable: true })
  lastName?: string; 

  @OneToMany(() => PasswordTypeORM, (password) => password.user)
  passwords: PasswordTypeORM[];
}
