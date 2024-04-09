import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Server } from "../../server/entities/server.entity";

@Entity()
export class Webhook{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column("text", {unique : true})
  url : string;

  // @Column("text",{array:true})
  // channel : string;

  @OneToMany(
    ()=> Server,
    (server) => server.webhook,
    {eager:true},
  )
  server : Server;
}