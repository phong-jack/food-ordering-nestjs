import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'order_status' })
export class OrderStatus extends BaseEntity {
  @PrimaryColumn()
  statusCode: number;

  @Column()
  statusReason: string;

  @Column()
  description: string;
}
