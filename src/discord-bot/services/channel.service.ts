import { Injectable, Logger } from "@nestjs/common";

type ChannelType = 0|2|4;
@Injectable()
export class ChannelService{
  private readonly logger = new Logger("ChannelService");

  async create([interaction],name:string, type: ChannelType, parentId?: string){

    if (!parentId)
      parentId = null;

    const channel = await interaction.guild.channels.create({
      name: name,
      type: type, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
      parent: parentId, //para categoria
    });

    return channel.id;

  }

}