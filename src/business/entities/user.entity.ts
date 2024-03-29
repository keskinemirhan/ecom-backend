import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./address.entity";
import { CommercialItem } from "./commercial-item.entity";
import { Exclude } from "class-transformer";
import { BasketItem } from "./basket-item.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isAdmin: boolean;

  @ManyToMany(() => BasketItem)
  @JoinTable()
  basketItems: BasketItem[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
