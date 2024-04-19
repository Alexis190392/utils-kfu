import { Injectable, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Status } from "../entities";
import { Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";


type ChannelType = 0|2|4;
@Injectable()
export class ChannelService{
  private readonly logger: Logger;
  constructor(
    private readonly client: Client,

    @InjectRepository(Status)
    private readonly statusRepository : Repository<Status>,
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

  @Cron('*/15 * * * * *')
  async editName() {

    const statusList = await this.statusRepository.find();

    for (const status of statusList) {
      const channel = await this.client.channels.fetch(status.channelId);

      if (!channel)
        throw new Error(`No se encontró ningún canal con el ID ${status.channelId}.`)

      if (!(channel instanceof TextChannel))
        throw new Error(`El canal con el ID ${status.channelId} no es un canal de texto.`);

      status.name = status.name.replace(' ', '-').toLowerCase();

      switch (+status.code) {
        case 200:
          status.name = `💚-${status.name}`;
          break;
        case 503:
          status.name = `💛-${status.name}`;
          break;
        case 404:
          status.name = `💔-${status.name}`;
          break;
      }

      if (status.name !== channel.name)
        await (channel as TextChannel).setName(`${status.name}`);
    }
  }

}