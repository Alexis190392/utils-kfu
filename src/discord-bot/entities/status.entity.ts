import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Status{
  @PrimaryColumn("text", {unique:true})
  channelId : string;

  @Column('text')
  name : string;

  @Column("numeric", {default:404})
  code : number;
}