import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  zipCode: string;

  @Column()
  contactName: string;

  @Column()
  contactSurname: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
