import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column( {unique : true})
  name : string;

  @Column('text')
  ip : string;

  @Column('text')
  port : string;

  @Column('text')
  user : string;

  @Column('text')
  pass : string;

  @Column('boolean',{
    default: true,
  })
  isActive : boolean;

}
