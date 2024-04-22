import { Injectable, Logger } from "@nestjs/common";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { InjectRepository } from "@nestjs/typeorm";
import { RecordLog } from "../../webadmin/entities/record-log.entity";
import { Repository } from "typeorm";

@Injectable()
export class WebhookService{
  private readonly logger = new Logger("WebhookService");
  constructor(
    private readonly client: Client,

    @InjectRepository(RecordLog)
    private readonly recordLogRepository : Repository<RecordLog>,
  ) {}

  async sendMessage(): Promise<void> {
    const recordLogs = await this.recordLogRepository.find({order: { date:'ASC' }})

    for (const recordLog of recordLogs) {
      if (recordLog) {
        const sendStatus = await this.sendToWebhook(recordLog.logs, recordLog.channelId, recordLog.webhookId, recordLog.date);
        if (sendStatus)
          await this.recordLogRepository.delete(recordLog);
      }
    }
  }


  async create([interaction], name:string, channelId: string, urlImage? :string){
    const channel =  interaction.guild.channels.cache.get(channelId);

    try {
      const webhook = await channel.createWebhook({
        name: name,
        avatar: urlImage,
      });
      console.log(`Created webhook -> ${webhook.name} - ${webhook.id}`);
      return webhook.id; // Devuelve el ID del webhook
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async sendToWebhook(message: string, channelId: string, webhookID:string, date: Date){

    const channel = await this.client.channels.fetch(channelId);
    const textChannel = channel as TextChannel; // Convierte el canal a TextChannel

    try {
      const webhooks = await textChannel.fetchWebhooks();

      //busqueda con id y tenga token
      const webhook = webhooks.find(wh => wh.id === webhookID && wh.token);

      if (!webhook) {
        return console.log('No webhook was found that I can use!');
      }

      const icon = `https://cdn.discordapp.com/icons/${textChannel.guild.id}/${textChannel.guild.icon}.webp`;

      const embed = new EmbedBuilder();
      embed.setTitle(webhook.name);
      embed.setColor('#ffaa00');
      embed.setDescription(message);
      embed.setTimestamp(date);
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

      return true;
    } catch (error) {
      this.logger.error('Error trying to send a message: ', error);
      return false;
    }
  }
}