import { Injectable } from "@nestjs/common";
import { DcUtils } from "../dc.utils";
import { EmbedBuilder } from "discord.js";
import { Moderator } from "../entities";

@Injectable()
export class Embeds{

  constructor(
    private readonly utils:DcUtils,
  ) {
  }

  async listModerators([interaction], list:Moderator[]){

    const name = interaction.guild.name;
    const color = this.utils.decimalToHex(await interaction.member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp`;
    let message = '';
    for (const mod of list) {
      message =`${message}- ${mod.name}\n`
    }

    const embed = new EmbedBuilder();
    embed.setColor(color);
    embed.setThumbnail(iconUser);
    embed.addFields(
      { name: 'Roles permitidos Admin:', value: message },
    );

    embed.setTimestamp();
    embed.setFooter({
      text: name,
      iconURL: icon
    })
    await interaction.reply({ embeds: [embed] });

  }
}