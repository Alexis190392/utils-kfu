import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Context } from "necord";

import { CreateRoleDto } from "./dto/create-role.dto";
import { Member } from "../member-dc/entities/member.entity";

@Injectable()
export class DcService {
  private readonly logger = new Logger('DiscordService')
  constructor(

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

  ) {}

  async getRoles(@Context() [interaction]){
    const rolesDC = await interaction.guild.roles.fetch();

    const roles=[];

    rolesDC.forEach(role => {
      const roleAdd = new CreateRoleDto();
      roleAdd.id = role.id;
      roleAdd.name = role.name;
      roles.push(roleAdd)
    })

    return roles;
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

