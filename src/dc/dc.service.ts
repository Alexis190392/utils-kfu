import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Context } from "necord";

import { Commons } from "../commons/commons";
import { Member, Role } from "./entities";
import { CreateRoleDto } from "./dto/create-role.dto";
import { WebadminService } from "../webadmin/webadmin.service";

@Injectable()
export class DcService {
  private readonly logger = new Logger('DiscordService')
  //TODO cambiar por lo de la bd
   private readonly ROLES : string = "Moderador,WM" //process.env.ROLE_MODERATOR;
  constructor(
    private readonly webadminService: WebadminService,
    private readonly commons :Commons,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

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

  async getUsers(@Context() [interaction]){
    const members = await interaction.guild.members.fetch();

    for (const member of members.values()) {
      const memberAdd = new Member();
      memberAdd.id = member.user.id;
      memberAdd.username= member.user.username;
      memberAdd.discriminator = member.user.discriminator;
      memberAdd.globalName = member.user.globalName;
      memberAdd.avatarHash = member.user.avatar;
      memberAdd.bot = member.user.bot;
      memberAdd.system = member.user.system;
      memberAdd.bannerHash = member.user.banner;
      memberAdd.accentColor = member.user.accentColor;
      memberAdd.flags = member.user.flags;
      memberAdd.avatarDecorationHash = member.user.avatarDecoration;
      memberAdd.joinedAt = member.joinedAt;
      memberAdd.timeInServer = this.timeDifference(member.joinedAt);

      memberAdd.roles = [];
      for (const role of member.roles.cache.values()) {
        memberAdd.roles.push(role.name);
      }

      try {
        await this.memberRepository.save(memberAdd);
      } catch (e){
        this.logger.error(`No se pudo agregar el usuario: ${memberAdd.username}`)
      }
    }
  }

  private timeDifference(value: Date){
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - value.getTime();
    return Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
  }
}

