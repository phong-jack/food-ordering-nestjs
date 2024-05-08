import { Order } from 'src/modules/order/entities/order.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  user: Relation<User>;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  orderId: number;
}
