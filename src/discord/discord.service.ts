import { Injectable } from '@nestjs/common';
import { WebadminService } from "../webadmin/webadmin.service";
import { Context } from "necord";
import * as process from "process";
import { Commons } from "../commons/commons";
import { PlayerDto } from "../webadmin/dtos/player.dto";

@Injectable()
export class DiscordService {

  private readonly ROLES : string = process.env.ROLE_MODERATOR;
  constructor(
    private readonly webadminService: WebadminService,
    private readonly commons :Commons,
  ) {}

  async sendMessage(text:string,@Context() [interaction]){

    const verify : boolean = await this.verifyRole([interaction])

    if (verify){
      await this.webadminService.sendMessage(text);
      return `Mensaje enviado: ${text}`;
    } else {
      return 'No tiene privilegios para este comando';
    }
  }

  async players(@Context() [interaction]){
    const verify : boolean = await this.verifyRole([interaction])

    if (verify){
      const players : PlayerDto[] = await this.webadminService.players();
      const names: string[] = players.map(player => player.name);
      return names.join('-');
    }else {
      return 'No tiene privilegios para este comando';
    }
  }

  private async verifyRole(@Context() [interaction]){
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

    return verify;
  }
}
