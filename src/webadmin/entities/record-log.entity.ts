import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecordLog{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column('text')
  logs : string;

  @Column('text')
  channelId : string;

  @Column('text')
  webhookId : string;

  @Column({ type: 'timestamptz' })
  date: Date;

}