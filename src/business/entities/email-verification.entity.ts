import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class EmailVerification {
  @PrimaryColumn("string")
  email: string;

  @Column()
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  count: number;

  @Column()
  controlled: boolean;
}
