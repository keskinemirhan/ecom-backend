import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommercialItem } from "./commercial-item.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CommercialItem, (commercialItem) => commercialItem.category)
  commercialItems: CommercialItem[];
}
