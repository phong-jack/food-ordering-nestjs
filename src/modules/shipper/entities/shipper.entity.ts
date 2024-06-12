import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShipperStatus } from '../constant/shipper.constant';

@Entity('shipper')
export class Shipper extends BaseEntity {
  //Try use uuid :)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'enum', enum: ShipperStatus, default: ShipperStatus.READY })
  status: ShipperStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
