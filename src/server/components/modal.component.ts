import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { Injectable } from "@nestjs/common";

// @Injectable()
export class ModalComponent{

  async newServer([interaction]){
    const modal = new ModalBuilder()
      .setCustomId(`newServer-${interaction.user.id}`)
      .setTitle('Agregar server - WebAdmin');

    const name = new TextInputBuilder()
      .setCustomId('name')
      .setLabel("Nombre del servidor:")
      .setStyle(TextInputStyle.Short);

    const ip = new TextInputBuilder()
      .setCustomId('ip')
      .setLabel("IP:")
      .setStyle(TextInputStyle.Short);

    const port = new TextInputBuilder()
      .setCustomId('port')
      .setLabel("Puerto:")
      .setStyle(TextInputStyle.Short);

    const user = new TextInputBuilder()
      .setCustomId('user')
      .setLabel("User Admin:")
      .setStyle(TextInputStyle.Short);

    const pass = new TextInputBuilder()
      .setCustomId('pass')
      .setLabel("Password Admin:")
      .setStyle(TextInputStyle.Short);


    const nameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(name);
    const ipActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ip);
    const portActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(port);
    const userActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(user);
    const passActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pass);

    return modal.addComponents(nameActionRow, ipActionRow, portActionRow, userActionRow, passActionRow);
  }


}