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

    const member = await interaction.member;
    const guild = await interaction.guild;
    const name = guild.name;
    const color = this.utils.decimalToHex(member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`;
    let message = '';
    for (const mod of list) {
      message =`${message}- ${mod.name}\n`
    }

    const embed = new EmbedBuilder();
    embed.setColor(color);
    embed.setThumbnail(iconUser);
    embed.addFields(
      { name: 'Roles permitidos Admin:', value: message },
      { name: '\u200B', value: '\u200B'},
      { name: '/admin', value: `Listar roles permitidos`},
      { name: '/set-admin', value: `Permitir nuevo rol`},
      { name: '/del-admin', value: `Negar permisos rol`}

    );

    embed.setTimestamp();
    embed.setFooter({
      text: name,
      iconURL: icon
    })
    await interaction.reply({ embeds: [embed] });

  }
}