import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./address.entity";
import { CommercialItem } from "./commercial-item.entity";
import { Exclude } from "class-transformer";

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

  @Column({ default: false })
  isAdmin: boolean;

  @ManyToMany(() => CommercialItem)
  @JoinTable()
  basketItems: CommercialItem[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
