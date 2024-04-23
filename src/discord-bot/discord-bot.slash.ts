import { Injectable } from "@nestjs/common";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";

import { DiscordBotService } from "./discord-bot.service";
import { TextDto } from "./dtos/discord.texto.dto";
import {
  KfService,
  ModeratorService } from "./services";

@Injectable()
export class DiscordBotSlash{

  constructor(
    private readonly dcService:DiscordBotService,
    private readonly server :KfService,
    private readonly moderatorService:ModeratorService,

  ) {}

  @SlashCommand({
    name: 'send',
    description: 'Enviar mensaje al servidor'
  })
  async onSend(@Context() [interaction]: SlashCommandContext, @Options() { text }: TextDto) {
    const response=  await this.moderatorService.sendMessage([interaction],text)
    return interaction.reply({content: response });
  }

  @SlashCommand({
    name: 'new-server',
    description: 'Agregar servidor'
  })
  async onNewServer(@Context() [interaction]){
    await this.server.createServer([interaction])
  }

  @SlashCommand({
    name: 'list-servers',
    description: 'Ver servidores añadidos'
  })
  async onListServers(@Context() [interaction]){
    await this.server.listServers([interaction]);
  }

  @SlashCommand({
    name: 'disable-server',
    description: 'Desactivar logs de servidor'
  })
  async onDisableServers(@Context() [interaction]){
    await this.server.activity([interaction],false);
  }

  @SlashCommand({
    name: 'enable-server',
    description: 'Desactivar logs de servidor'
  })
  async onEnableServers(@Context() [interaction]){
    await this.server.activity([interaction],true);
  }

  @SlashCommand({
    name: 'list-admin',
    description: 'Estado de moderadores'
  })
  async onSeeModeratos(@Context() [interaction]){
    await this.moderatorService.SeeModeratos([interaction])
  }

  @SlashCommand({
    name: 'allow-admin',
    description: 'Agregar permisos admin'
  })
  async onSetModeratos(@Context() [interaction]){
    await this.moderatorService.selectModerator([interaction])
  }

  //TODO reparar
  @SlashCommand({
    name: 'remove-admin',
    description: 'Eliminar permisos admin'
  })
  async onDeleteModeratos(@Context() [interaction]){
    await this.moderatorService.deleteModerator('Rythm')
  }

  @SlashCommand({
    name: 'skip-logs',
    description: 'Saltar logs que contengan...'
  })
  async onSkipLogs(@Context() [interaction],@Options() { text }: TextDto){
    const response = await this.dcService.skipLogs([interaction],text)
    return interaction.reply({content: response });
  }

}