import { Injectable } from '@nestjs/common';
import {
  Context, Options,
  SlashCommand,
  SlashCommandContext, StringOption
} from "necord";
import { TextDto } from "./dtos/discord.texto.dto";
import { WebadminService } from "../webadmin/webadmin.service";
import { DiscordService } from "./discord.service";

@Injectable()
export class SlashCommands {

  constructor(
     private readonly discordService:DiscordService,
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
    const response=  await this.discordService.sendMessage(text, [interaction])
    return interaction.reply({content: response });
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