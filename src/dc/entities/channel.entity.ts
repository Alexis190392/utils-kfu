import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column("text",{unique : true})
  name: string;

}