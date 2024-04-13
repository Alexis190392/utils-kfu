import { Injectable, Logger } from "@nestjs/common";
import { ServerService } from "../../server/server.service";
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { CreateServerDto } from "../../server/dto/create-server.dto";

@Injectable()
export class ServerServiceDc{
  private readonly logger = new Logger('ServerServiceDc');

  constructor(
    private readonly serverService : ServerService,
  ) {}

  async createServer([interaction]){
    const modal = new ModalBuilder()
      .setCustomId(`newServer-${interaction.user.id}`)
      .setTitle('Agregar server');

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

    modal.addComponents(nameActionRow, ipActionRow, portActionRow, userActionRow, passActionRow);

    await interaction.showModal(modal);

    const filter= (interaction) => interaction.customId === `newServer-${interaction.user.id}`;

    interaction
      .awaitModalSubmit({filter,time:60000})
      .then(async (modalInteraction)=>{
        const name = modalInteraction.fields.getTextInputValue('name');
        const ip = modalInteraction.fields.getTextInputValue('ip');
        const port = modalInteraction.fields.getTextInputValue('port');
        const user = modalInteraction.fields.getTextInputValue('user');
        const pass = modalInteraction.fields.getTextInputValue('pass');

        const newServer = new CreateServerDto();
        newServer.name = name;
        newServer.ip = ip;
        newServer.port = port;
        newServer.user = user;
        newServer.pass = pass;

        const server = await this.serverService.create(newServer);
        this.logger.log(`New server: ${server.name} - ID: ${server.id}`)

        modalInteraction.reply(`Nuevo server agregado: ${server.name}`)


      })
      .catch((e)=>{
        this.logger.warn(`No hubo respuesta: ${e.message}`)
      });
  }

}