import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Webhook } from "../../dc/entities";

@Entity()
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id : string;

  @Column( {unique : true})
  name : string;

  @Column('text',{unique: true})
  slug: string;

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

  @ManyToOne(
    () => Webhook,
    (webhook)=> webhook.server,
    {onDelete: 'CASCADE'}
  )
  webhook : Webhook;

  @BeforeInsert()
  checkSlugInsert(){
    if (!this.slug){
      this.slug = this.name;
    }
    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'');
  }

  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug.toLowerCase()
      .replaceAll(' ','_')
      .replaceAll("'",'');
  }
}
