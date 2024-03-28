import { StringSelectMenuBuilder } from "discord.js";

export class StringSelectMenu{

  create(customId: string, placeholder: string, list: any){
    return  new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(...list);
  }


}