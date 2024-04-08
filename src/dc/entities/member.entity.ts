import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class Member{

  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column('text')
  username : string;

  @Column('text')
  discriminator : string;

  @Column('text')
  globalName : string;

  @Column('text')
  avatarHash : string;

  @Column('text')
  avatarDecorationHash : string;

  @Column('text')
  avatarUrl : string;

  @Column('text')
  bannerHash : string;

  @Column('text')
  bannerUrl : string;

  @Column('text')
  accentColor : string;

  @Column('text')
  bot : string;

  @Column('text')
  system : string;

  @Column('text')
  flags : string;

  @Column('text')
  joinedAt : string;

  @Column('numeric')
  timeInServer : number;

  @OneToMany(
    ()=> Role,
    (role) => role.member,
    {cascade:true}
  )
  roles : Role[];

}