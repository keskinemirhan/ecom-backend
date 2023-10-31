import {
  Column,
  CreateDateColumn,
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

  // Event Records
  @Column()
  isPaid: boolean;

  @Column()
  isDelivered: boolean;

  @Column()
  isCanceled: boolean;

  @Column()
  isRequested: boolean;

  @Column()
  isFailed: boolean;

  // Event Dates
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "datetime", nullable: true })
  paidAt: Date;

  @Column({ type: "datetime", nullable: true })
  canceledAt: Date;

  @Column({ type: "datetime", nullable: true })
  requestedAt: Date;

  @Column({ type: "datetime", nullable: true })
  deliveredAt: Date;

  @Column({ type: "datetime", nullable: true })
  failedAt: Date;

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
