import { StringSelectMenuBuilder } from "discord.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ComponentsStringSelect{

  create(customId: string, placeholder: string, list: any){
    return  new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(...list);
  }


}