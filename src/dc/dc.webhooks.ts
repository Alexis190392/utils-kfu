import { Injectable } from "@nestjs/common";
import { InjectDiscord } from "nestjs-discord-webhook";
import { Client, EmbedBuilder, NewsChannel, TextChannel, ThreadChannel, WebhookClient } from "discord.js";

@Injectable()
export class DcWebhooks {
  constructor(
    // @InjectDiscord() private readonly discord: WebhookClient,
    private readonly interaction:Client
  ) {}

  async sendMessage(message: string): Promise<void> {
    try {
      if (message !== '')
        // await this.discord.send(message);
      // console.log(this.discord);
      await this.findWebhook(message);

    } catch (error) {
      console.error('Error al enviar el mensaje al webhook:', error);
    }
  }

  async findWebhook(message: string){
    const embed = new EmbedBuilder()
      .setTitle('Some Title lalala')
      .setColor(0x00FFFF);

    // const channelID = await interaction.channelId;
    const channel = this.interaction.channels.cache.get("1215373200783966318");
    // channel = this.interaction.
    // const channel =  this.interaction.channels.cache;
    console.log("1---------------------------------------------------------------------------------------------------------");

    // console.log(channel);
    const textChannel = channel as TextChannel;
    // const webhooks = await textChannel.fetchWebhooks()

    // const webhook = webhooks.find(wh => wh.id === '1228186227996364800' && wh.token);
    // // console.log(textChannel);
    // // console.log(webhooks);
    // // console.log(webhook);

    // if (!webhook) {
    //   return console.log('No webhook was found that I can use!');
    // }

console.log("2---------------------------------------------------------------------------------------------------------");

    try {
      const webhooks = await textChannel.fetchWebhooks()
      // console.log(webhooks);
      console.log("----------------------------------------------------------------------------------------------------------");
      // const webhook = webhooks.find(wh => wh.token);

      // busqueda con id y tenga token
      const webhook = webhooks.find(wh => wh.id === '1228197036248268881' && wh.token);

      console.log(webhook);

      if (!webhook) {
        return console.log('No webhook was found that I can use!');
      }

      console.log(webhook);

      await webhook.send({
        content: message,
        // username: 'some-usernameq',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error trying to send a message: ', error);
    }
  }


}