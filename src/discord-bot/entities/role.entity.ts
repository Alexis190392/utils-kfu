import {
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Role{

  @PrimaryColumn ("text", {unique:true})
  id : string;

  @Column("text", {unique:true})
  name : string;

}