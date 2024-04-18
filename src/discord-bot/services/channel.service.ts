import { Injectable, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";


type ChannelType = 0|2|4;
@Injectable()
export class ChannelService{
  private readonly logger: Logger;
  constructor(
    private readonly client: Client
  ) {
  }

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

  async editName(channelId: string, name: string, status: number){

    try {
      const channel = await this.client.channels.fetch(channelId);

      if (!channel) {
        throw new Error(`No se encontró ningún canal con el ID ${channelId}.`);
      }

      if (!(channel instanceof TextChannel)) {
        throw new Error(`El canal con el ID ${channelId} no es un canal de texto.`);
      }

      name = name.replace(' ','-').toLowerCase();

      switch (status){
        case 200:
          name = `💚-${name}`;
          break;
        case 502:
          name = `💛-${name}`;
          break;
        case 404:
          name = `💔-${name}`;
          break;
        default:
          name = `💔-${name}`;
          break;
      }

      if (name !== channel.name) {
        await (channel as TextChannel).setName(`${name}`);
      }

    } catch (error) {
      this.logger.error(error.code);
    }
  }

}