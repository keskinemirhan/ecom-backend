import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./address.entity";
import { BasketItem } from "./basket-item.entity";
import { User } from "./user.entity";

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

  @ManyToMany(() => BasketItem)
  @JoinTable()
  basketItems: BasketItem[];

  @ManyToOne(() => Address)
  billingAddress: Address;

  @ManyToOne(() => Address)
  shippingAddress: Address;

  @ManyToOne(() => User)
  user: User;
}
