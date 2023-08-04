import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./address.entity";
import { CommercialItem } from "./commercial-item.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  conversationId: string;

  @Column()
  paymentId: string;

  @Column()
  totalPrice: string;

  @Column()
  isPaid: boolean;

  @Column()
  isDelivered: boolean;

  @Column()
  isCanceled: boolean;

  @ManyToMany(() => CommercialItem)
  @JoinTable()
  basketItems: CommercialItem[];

  @ManyToOne(() => Address)
  billingAddress: Address;

  @ManyToOne(() => Address)
  shippingAddress: Address;
}
