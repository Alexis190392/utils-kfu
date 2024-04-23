import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class SkipLogs{
  @PrimaryColumn("text", {unique:true})
  channelId : string;

  @Column('text')
  text : string;
}