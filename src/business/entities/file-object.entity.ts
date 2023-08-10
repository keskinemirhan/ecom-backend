import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileObject {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;
}
