import { Injectable } from '@nestjs/common';
import {
  Context,
  SlashCommand,
  SlashCommandContext,
} from 'necord';
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
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
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