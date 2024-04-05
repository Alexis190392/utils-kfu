import { Injectable } from "@nestjs/common";
import { InjectDiscord } from "nestjs-discord-webhook";
import { EmbedBuilder, WebhookClient } from "discord.js";

@Injectable()
export class DiscordWebhooks {
  constructor(
    @InjectDiscord() private readonly discord: WebhookClient,
  ) {}

  async sendMessage(message): Promise<void> {
    try {
      if (message !== '') {
      //   await this.discord.send(message);
      // } else{
        const exampleEmbed = new EmbedBuilder()
          .setColor(0xFFC300)
          // .setTitle('Logs Server')
          // .setURL('https://discord.js.org/')
          .setAuthor({
            name: 'KF Universal',
            // iconURL: 'https://i.imgur.com/AfFp7pu.png',
            // url: 'https://discord.js.org'
          })
          .setDescription(message)
          .setThumbnail('https://cdn.discordapp.com/icons/721570275636019262/f88b366624336daf0df6f236f3eb33b0.webp?size=96')
          // .addFields(
          //   { name: 'Server Logs', value: message },
          //   { name: '\u200B', value: '\u200B' },
          //   { name: 'Inline field title', value: 'Some value here', inline: true },
          //   { name: 'Inline field title', value: 'Some value here', inline: true },
          // )
          // .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
          // .setImage('https://i.imgur.com/AfFp7pu.png')
          .setTimestamp()
          .setFooter({
            text: 'Envía mensajes con /send',
            iconURL: 'https://cdn.icon-icons.com/icons2/4072/PNG/96/shortcut_right_arrow_skip_direction_next_redo_icon_258803.png'
          })
        ;

        const embed2 = new EmbedBuilder();
        embed2.setColor(0xFFC400);
        embed2.setAuthor({ name: 'KF Universal'});
        embed2.setThumbnail('https://cdn.discordapp.com/icons/721570275636019262/f88b366624336daf0df6f236f3eb33b0.webp?size=96');
        embed2.addFields({ name: 'Server Logs', value: message });
        embed2.setTimestamp();
        embed2.setFooter({
            text: 'Envía mensajes con /send',
            iconURL: 'https://cdn.icon-icons.com/icons2/4072/PNG/96/shortcut_right_arrow_skip_direction_next_redo_icon_258803.png'
          })
        ;





        await this.discord.send({
          embeds: [exampleEmbed],
        });
      }
    } catch (error) {
      console.error('Error al enviar el mensaje al webhook:', error);
    }
  }
}