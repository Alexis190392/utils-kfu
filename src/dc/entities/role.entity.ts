import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class Role{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column("text", {unique:true})
  name : string;

  @ManyToOne(
    ()=> Member,
    (member) => member.roles,
  )
  member : Member;

}