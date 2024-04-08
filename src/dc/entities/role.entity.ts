import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Member } from "./member.entity";

@Entity()
export class Role{

  @PrimaryColumn ("text", {unique:true})
  id : string;

  @Column("text", {unique:true})
  name : string;

  @ManyToOne(
    ()=> Member,
    (member) => member.roles,
  )
  member : Member;

}