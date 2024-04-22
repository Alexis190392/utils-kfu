import { Injectable, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Server, Status } from "../entities";
import { Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";


type ChannelType = 0|2|4;
@Injectable()
export class ChannelService{
  private readonly logger = new Logger("ChannelService");
  constructor(
    private readonly client: Client,

    @InjectRepository(Status)
    private readonly statusRepository : Repository<Status>,

    @InjectRepository(Server)
    private readonly serverRepository : Repository<Server>,
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

  // @Cron('*/10 * * * * *')
  // async editName() {
  //   try {
  //     const statusList = await this.statusRepository.find();
  //
  //     for (const status of statusList) {
  //       const channel = await this.client.channels.fetch(status.channelId);
  //
  //       if (!channel)
  //         throw new Error(`No se encontró ningún canal con el ID ${status.channelId}.`)
  //
  //       if (!(channel instanceof TextChannel))
  //         throw new Error(`El canal con el ID ${status.channelId} no es un canal de texto.`);
  //
  //       const server = await this.serverRepository.findOne({
  //         where: {
  //           channelId:status.channelId,
  //           name: status.name
  //         }});
  //
  //       if (!server.isActive){
  //         status.code = 400;
  //         await this.statusRepository.save(status)
  //       }
  //
  //       status.name = status.name.replace(' ', '-').toLowerCase();
  //
  //       switch (+status.code) {
  //         case 200:
  //           status.name = `💚-${status.name}`;
  //           break;
  //         case 503:
  //           status.name = `💛-${status.name}`;
  //           break;
  //         case 404:
  //           status.name = `💔-${status.name}`;
  //           break;
  //         case 400:
  //           status.name = `🖤-${status.name}`;
  //           break;
  //
  //       }
  //
  //       if (status.name !== channel.name)
  //         await (channel as TextChannel).setName(`${status.name}`);
  //     }
  //   }catch (e) {
  //     this.logger.error(e.message);
  //   }
  //
  // }


  // async editName(channelId:string,status:number,originName:string) {
  //
  //       const channel = await this.client.channels.fetch(channelId);
  //
  //       if (!channel)
  //         throw new Error(`No se encontró ningún canal con el ID ${channelId}.`)
  //
  //       if (!(channel instanceof TextChannel))
  //         throw new Error(`El canal con el ID ${channelId} no es un canal de texto.`);
  //
  //       console.log(`${channel.name} - ${status}`);
  //
  //       originName = originName.replace(' ', '-').toLowerCase();
  //
  //       let health = `🖤`;
  //
  //       switch (+status) {
  //         case 200:
  //           health = `💚`;
  //           break;
  //         case 503:
  //           health = `💛`;
  //           break;
  //         case 404:
  //           health = `💔`;
  //           break;
  //         case 400:
  //           health = `🖤`;
  //           break;
  //
  //       }
  //
  //       const newChannelName = `${health}${originName}`;
  //   try {
  //       if (newChannelName != channel.name) {
  //         console.log("ENTRA AL DISTINTO");
  //         const a = await (channel as TextChannel).setName(newChannelName)
  //         console.log(a);
  //          await new Promise(resolve => setTimeout(resolve, 5000));
  //         console.log("Nuevo nombre:" + newChannelName);
  //       }
  //     console.log('===========================================================================');
  //   }catch (e) {
  //     this.logger.error(e.message);
  //   }
  //
  // }

}