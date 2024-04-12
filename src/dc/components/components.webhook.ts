import { Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";

@Injectable()
export class ComponentsWebhook{


  async create([interaction], name:string, urlImage:string){
    const channel = await interaction.channel;
    // const channelID = await interaction.channelId;

    channel.createWebhook({
      name: name,
      avatar: urlImage,
    })
      .then(webhook => console.log(`Created webhook ${webhook}`))
      .catch(console.error);
  }

  async findWebhook([interaction], channelId: string){
    const embed = new EmbedBuilder()
      .setTitle('Some Title lalala')
      .setColor(0x00FFFF);

    // const channelID = await interaction.channelId;
    // const channel = interaction.channels.cache.get("1215373200783966318");
    const channel =  interaction.guild.channels.cache.get(channelId);

    try {
      const webhooks = await channel.fetchWebhooks();
      console.log(webhooks);
      console.log("----------------------------------------------------------------------------------------------------------");
      // const webhook = webhooks.find(wh => wh.token);

      //busqueda con id y tenga token
      const webhook = webhooks.find(wh => wh.id === '1228186227996364800' && wh.token);

      console.log(webhook);

      if (!webhook) {
        return console.log('No webhook was found that I can use!');
      }

      // console.log(webhook);

      await webhook.send({
        content: 'Webhook test',
        // username: 'some-usernameq',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png',
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error trying to send a message: ', error);
    }
  }



}