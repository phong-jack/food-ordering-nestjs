import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { SETTING_KEY } from '../constants/setting.constant';

@Entity({ name: 'setting' })
export class Setting extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SETTING_KEY })
  key: SETTING_KEY;

  @Column()
  value: string;

  @ManyToOne(() => User, (user) => user.settings)
  user: Relation<User>;

  @UpdateDateColumn()
  updatedAt: Date;
}
