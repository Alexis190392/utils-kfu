import { Injectable, Logger } from "@nestjs/common";
import { Client } from "discord.js";

type ChannelType = 0|2|4;
@Injectable()
export class ChannelService{
  private readonly logger = new Logger("ChannelService");

  constructor(
    private readonly client: Client,
  ) {}

  async createWithInteraction([interaction],name:string, type: ChannelType, parentId?: string){

    if (!parentId)
      parentId = null;

    const channel = await interaction.guild.channels.create({
      name: name,
      type: type, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
      parent: parentId, //para categoria
    });

    return channel.id;

  }

  async createWithClient(guildId:string, name:string, type: ChannelType, parentId?: string){
    const guild = this.client.guilds.cache.get(guildId);

    if (!guild) {
      console.log(`No se pudo encontrar el servidor con ID ${guildId}`);
      return;
    }

    const channel = await guild.channels.create({
      type: type,
      name: name,
      parent: parentId,
    });

    return channel.id;
  }

}