import { Injectable } from '@nestjs/common';
import {
  Context, Options,
  SlashCommand,
  SlashCommandContext, StringOption
} from "necord";

import { Modals } from "./components";
import { DcService } from "./dc.service";
import { TextDto } from "./dto/discord.texto.dto";

@Injectable()
export class SlashCommands {

  constructor(
     private readonly dcService:DcService,
     private readonly modals:Modals,
  ) {
  }

  @SlashCommand({
    name: 'ping',
    description: 'Ping-Pong Command',
  })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }

  @SlashCommand({
    name: 'send',
    description: 'Enviar mensaje al servidor'
  })
  async onSend(@Context() [interaction]: SlashCommandContext, @Options() { text }: TextDto) {
    const response=  await this.dcService.sendMessage(text, [interaction])
    return interaction.reply({content: response });
  }

  @SlashCommand({
    name: 'roles',
    description: 'Extraer roles'
  })
  async onRole(@Context() [interaction]){
    await this.dcService.getRoles([interaction]);
    return interaction.reply({content: "Prueba rol" });
  }

  @SlashCommand({
    name: 'users',
    description: 'Extraer users'
  })
  async onUsers(@Context() [interaction]){
    await this.dcService.getUsers([interaction]);
    return interaction.reply({content: "Prueba users" });
  }


  @SlashCommand({
    name: 'add-server',
    description: 'Agregar servidor'
  })
  async onServers(@Context() [interaction]){
     await this.modals.createServer([interaction])
  }

  @SlashCommand({
    name: 'admin',
    description: 'Estado de moderadores'
  })
  async onSeeModeratos(@Context() [interaction]){
    await this.dcService.SeeModeratos([interaction])
  }

  @SlashCommand({
    name: 'set-admin',
    description: 'Agregar permisos admin'
  })
  async onSetModeratos(@Context() [interaction]){
    await this.dcService.selectModerator([interaction])
  }

  //muestra listado de canales de texto
  // @SlashCommand({
  //   name: 'logs-server',
  //   description: 'Select a text channel for server logs',
  // })
  // public async onLogsServer(@Context() [interaction]: SlashCommandContext){
  //   await this.discordService.onLogsServer([interaction]);
  // }

}