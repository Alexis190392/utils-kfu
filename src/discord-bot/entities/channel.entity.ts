import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel{

  @PrimaryColumn("text", {unique:true})
  id : string;

  @Column("text",{unique : true})
  guildId : string

  @Column("text",)
  name: string;

  @Column("text",)
  type: string;

}