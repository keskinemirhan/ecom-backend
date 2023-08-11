import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CommercialItem } from "./commercial-item.entity";

@Entity()
export class BasketItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  count: number;

  @ManyToOne(() => CommercialItem, { eager: true })
  @JoinTable()
  item: CommercialItem;
}
