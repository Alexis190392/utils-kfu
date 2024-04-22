import { Injectable, Logger } from "@nestjs/common";
import { Client, TextChannel } from "discord.js";

@Injectable()
export class WhService {

  private readonly logger = new Logger("WhService");

  constructor(
    private readonly client: Client,
  ) {
  }


  async editName(channelId:string,status:number,originName:string) {

    const channel = await this.client.channels.fetch(channelId);

    if (!channel)
      throw new Error(`No se encontró ningún canal con el ID ${channelId}.`)

    if (!(channel instanceof TextChannel))
      throw new Error(`El canal con el ID ${channelId} no es un canal de texto.`);

    originName = originName.replace(' ', '-').toLowerCase();

    let health = `🖤`;

    switch (+status) {
      case 200:
        health = `💚`;
        break;
      case 503:
        health = `💛`;
        break;
      case 404:
        health = `💔`;
        break;
      case 400:
        health = `🖤`;
        break;

    }

    const newChannelName = `${health}${originName}`;
    try {
      if (newChannelName != channel.name) {
        const a = await (channel as TextChannel).setName(newChannelName)
      }
    } catch (e) {
      this.logger.error(e.message);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
