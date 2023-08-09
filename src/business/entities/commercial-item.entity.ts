import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class CommercialItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.commercialItems, {
    eager: true,
    onDelete: "SET NULL",
  })
  category: Category;
}
