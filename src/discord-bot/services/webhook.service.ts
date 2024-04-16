import { Injectable } from "@nestjs/common";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { EmbedFieldsDto } from "../dtos/embedFields.dto";

@Injectable()
export class WebhookService{
  constructor(
    private readonly client: Client
    // @InjectDiscord() private readonly discord: WebhookClient,
  ) {}

  async sendMessage(message: string, channelId: string, webhookId: string): Promise<void> {
    try {
      if (message !== '') {
        await this.findWebhook(message, channelId, webhookId);
      }

    } catch (error) {
      console.error('Error al enviar el mensaje al webhook:', error);
    }
  }


  async create([interaction], name:string, channelId: string, urlImage? :string){
    // const channel = await interaction.channel;
    //
    // channel.createWebhook({
    //   name: name,
    //   avatar: urlImage,
    // })
    //   .then(webhook => console.log(`Created webhook -> ${webhook.name} - ${webhook.id}`))
    //   .catch(console.error);
    // const channel = await interaction.channel;
    const channel =  interaction.guild.channels.cache.get(channelId);

    try {
      const webhook = await channel.createWebhook({
        name: name,
        avatar: urlImage,
      });
      console.log(`Created webhook -> ${webhook.name} - ${webhook.id}`);
      return webhook.id; // Devuelve el ID del webhook
    } catch (error) {
      throw error;
    }
  }

  async findWebhook(message: string, channelId: string, webhookID:string){
    const embed = new EmbedBuilder()
      .setTitle('Some Title lalala')
      .setColor(0x00FFFF);

    // const channelID = await interaction.channelId;
    // const channel = interaction.channels.cache.get("1215373200783966318");
    // const channel =  interaction.guild.channels.cache.get(channelId);
    const channel = await this.client.channels.fetch(channelId);
    const textChannel = channel as TextChannel; // Convierte el canal a TextChannel

    try {
      const webhooks = await textChannel.fetchWebhooks();
      // console.log(webhooks);
      // console.log("----------------------------------------------------------------------------------------------------------");
      // const webhook = webhooks.find(wh => wh.token);

      //busqueda con id y tenga token
      const webhook = webhooks.find(wh => wh.id === webhookID && wh.token);

      // console.log(webhook);

      if (!webhook) {
        return console.log('No webhook was found that I can use!');
      }

      const icon = `https://cdn.discordapp.com/icons/${textChannel.guild.id}/${textChannel.guild.icon}.webp`;

      const embed = new EmbedBuilder();
      embed.setTitle(webhook.name);
      embed.setColor('#ffaa00');
      embed.setDescription(message);
      embed.setTimestamp();
      embed.setFooter({
        text: '[ /send ] para enviar mensajes',
        iconURL: icon
      })

      await webhook.send({
        // content: message,
        username: textChannel.name,
        avatarURL: icon,
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error trying to send a message: ', error);
    }
  }
}