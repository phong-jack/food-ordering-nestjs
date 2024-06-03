import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_detail')
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  order: Relation<Order>;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  price: number;
}
