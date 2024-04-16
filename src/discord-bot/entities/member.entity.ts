import {
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Member{

  @PrimaryColumn("text", {unique:true})
  id : string;

  @Column('text')
  username : string;

  @Column('text')
  discriminator : string;

  @Column('text',{ nullable: true })
  globalName : string;

  @Column('text')
  avatarHash : string;

  @Column('text',{ nullable: true })
  avatarDecorationHash : string;

  @Column('text',{ nullable: true })
  avatarUrl : string;

  @Column('text',{ nullable: true })
  bannerHash : string;

  @Column('text',{ nullable: true })
  bannerUrl : string;

  @Column('text',{ nullable: true })
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

  @Column("text",{array:true, default:[]})
  roles : string[];

}