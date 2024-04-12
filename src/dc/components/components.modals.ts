import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";
import { Injectable, Logger } from "@nestjs/common";
import { CreateServerDto } from "../../server/dto/create-server.dto";
import { ServerService } from "../../server/server.service";
import { Server } from "../../server/entities/server.entity";

@Injectable()
export class ComponentsModals{

  private readonly logger = new Logger('Modals');

  constructor(
    private readonly serverService : ServerService,
  ) {
  }

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

  async addWebhook([interaction],server: Server){
    console.log("1");
    const modal = new ModalBuilder()
      .setCustomId(`webhook-${interaction.user.id}`)
      .setTitle(`Agregar webhook a ${server.name}`);

    console.log(modal);

    const url = new TextInputBuilder()
      .setCustomId('url')
      .setLabel("Url del Webhook:")
      .setStyle(TextInputStyle.Short);


    const urlActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(url);

    modal.addComponents(urlActionRow);
    console.log("3");
    await interaction.showModal(modal);
    console.log("4");

    return modal;
    // const filter= (interaction) => interaction.customId === `newServer-${interaction.user.id}`;
    //
    // interaction
    //   .awaitModalSubmit({filter,time:60000})
    //   .then(async (modalInteraction)=>{
    //     const url = modalInteraction.fields.getTextInputValue('url');
    //
    //     console.log(url);

        // const newServer = new CreateServerDto();
        // newServer.name = name;
        // newServer.ip = ip;
        // newServer.port = port;
        // newServer.user = user;
        // newServer.pass = pass;
        //
        // const server = await this.serverService.create(newServer);
        // this.logger.log(`New server: ${server.name} - ID: ${server.id} - ${server.webhook}`)
        //
        // modalInteraction.reply(`Nuevo server agregado: ${server.name}`)

      //
      // })
      // .catch((e)=>{
      //   this.logger.warn(`No hubo respuesta: ${e.message}`)
      // });
  }



}