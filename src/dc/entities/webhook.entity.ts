import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Webhook{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column("text", {unique : true})
  url : string;

  @Column("text",{array:true})
  channel : string;
}