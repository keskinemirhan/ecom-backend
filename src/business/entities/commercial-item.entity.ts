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
  price: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.commercialItems, {
    eager: true,
  })
  category: Category;
}
