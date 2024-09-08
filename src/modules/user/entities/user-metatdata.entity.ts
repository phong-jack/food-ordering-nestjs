import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({})
@Unique('UQ_UserMetadata_Key_UserId', ['key', 'user'])
export class UserMetadata extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  key: string;

  @Column({})
  value: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
