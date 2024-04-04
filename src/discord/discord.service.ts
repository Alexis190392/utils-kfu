import { Injectable } from '@nestjs/common';
import { WebadminService } from "../webadmin/webadmin.service";
import { Context } from "necord";
import * as process from "process";
import { Commons } from "../commons/commons";

@Injectable()
export class DiscordService {

  private readonly ROLES : string = process.env.ROLE_MODERATOR;
  constructor(
    private readonly webadminService: WebadminService,
    private readonly commons :Commons,
  ) {}

  async sendMessage(text:string,@Context() [interaction]){
    const allows= this.commons.splitLines(this.ROLES);
    const member = await interaction.member;
    const roles = member.roles.cache.map(role => role.name);

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
}
