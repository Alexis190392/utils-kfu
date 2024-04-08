import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { WebadminService } from "../webadmin/webadmin.service";
import { Context } from "necord";
import * as process from "process";
import { Commons } from "../commons/commons";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../dc/entities";
import { Repository } from "typeorm";
import { CreateRoleDto } from "../dc/dto/create-role.dto";

@Injectable()
export class DiscordService {

  private readonly logger = new Logger('DiscordService')
  private readonly ROLES : string = process.env.ROLE_MODERATOR;
  constructor(
    private readonly webadminService: WebadminService,
    private readonly commons :Commons,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async sendMessage(text:string,@Context() [interaction]){
    const allows= this.commons.splitLines(this.ROLES);
    const member = await interaction.member;
    const roles = member.roles.cache.map(role => role.name);

    console.log(allows);
    console.log(roles);
    let verify = false;

    for (const allow of allows) {
      for (const role of roles) {
        if (allow === role){
          verify = true;
          break;
        }
        if (verify)
          break;
      }
    }

    if (verify){
      await this.webadminService.sendMessage(text);
      return `Mensaje enviado: ${text}`;
    } else {
      return 'No tiene privilegios para este comando';
    }
  }


  async getRoles(@Context() [interaction]){
    const roles = await interaction.guild.roles.fetch();

    roles.forEach(role => {
      const roleAdd = new CreateRoleDto();
      roleAdd.id = role.id;
      roleAdd.name = role.name;
      try {
        const roleSave = this.roleRepository.create(roleAdd);
        this.roleRepository.save(roleSave);
      } catch (e){
        this.logger.error(`No se pudo agregar el rol: ${roleAdd.name}`)
      }
    })
  }



}
