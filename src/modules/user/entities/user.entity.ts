import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { UserRole } from '../constants/user.enum';
import { Shop } from 'src/modules/shop/entities/Shop';
import { Exclude } from 'class-transformer';
import { Setting } from 'src/modules/setting/entities/setting.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false, length: 50 })
  firstName: string;

  @Column({ nullable: true, length: 50 })
  lastName: string;

  @Column({ unique: true })
  email?: string;

  @Column({ nullable: true, unique: true })
  phone?: string;

  @Column({ unique: true, length: 255 })
  username?: string;

  @Exclude()
  @Column()
  password?: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne((type) => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @OneToMany(() => Setting, (setting) => setting.user)
  settings: Relation<Setting[]>;

  @Column({ default: false })
  isActive?: boolean;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;
}
